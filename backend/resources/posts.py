from flask_restful import Resource, reqparse

from backend.models.TextPostModel import TextPostModel
from backend.models.accounts import AccountsModel, auth, g


class Posts(Resource):

    @auth.login_required()
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("limit", type=int, required=True, nullable=False, help={"Number of posts to retrieve"})
        parser.add_argument("offset", type=int, required=True, nullable=False, help={"Number of posts to skip"})
        data = parser.parse_args()
        posts = TextPostModel.get_groups(data["limit"], data["offset"])
        if posts:
            return {"posts": [post.json() for post in posts]}, 200
        return {"message": "No posts were found"}, 404

    @auth.login_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("text", type=str, required=True, nullable=False, help={"Text of the post"})
        parser.add_argument("parent_id", type=int, required=False, nullable=True, help={"Parent of the post"})
        data = parser.parse_args()
        new_post = TextPostModel(data["text"])
        new_post.account = AccountsModel.get_by_username(g.user.username)
        if "parent_id" in data:
            new_post.parent = TextPostModel.get_by_id(data["parent_id"])
        try:
            new_post.save_to_db()
        except Exception as e:
            return {"message": "An error occurred creating the post"}, 500
        return {"post": new_post.json()}, 201

    @auth.login_required()
    def put(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument("archived", type=bool, required=True, nullable=False, help={"Archive post"})
        data = parser.parse_args()
        post = TextPostModel.get_by_id(id)
        if post is None:
            return {"message": "No post was found"}, 404
        if post.account.username != g.user.username:
            return {"message": "Unauthorized!"}, 403
        try:
            post.archived = data["archived"]
            post.save_to_db()
        except Exception as e:
            return {"message": "An error occurred updating the post"}, 500
        return {"message": "Post updated successfully!"}, 200

    @auth.login_required()
    def delete(self, id):
        post = TextPostModel.get_by_id(id)
        if post is None:
            return {"message": "No post was found"}, 404
        if post.account.username != g.user.username:
            return {"message": "Unauthorized!"}, 403
        try:
            post.delete_from_db()
        except Exception as e:
            return {"message": "An error occurred deleting the post"}, 500
        return {"message": "Post deleted successfully!"}, 200

class UserPosts(Resource):

    @auth.login_required()
    def get(self,user=None):
        parser = reqparse.RequestParser()
        parser.add_argument("limit", type=int, required=True, nullable=False, help={"Number of posts to retrieve"})
        parser.add_argument("offset", type=int, required=True, nullable=False, help={"Number of posts to skip"})
        data = parser.parse_args()
        if(user==None):
            us=g.user;
        else:
            us=AccountsModel.get_by_username(user)
        if(us):
            posts = TextPostModel.get_groups_by_account(us.id, data["limit"], data["offset"])
            if posts:
                return {"posts": [post.json() for post in posts]}, 200
            return {"message": "No posts were found"}, 404
        else:
            return {"message": "User not found"}, 404

