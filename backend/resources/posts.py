from backend.models.accounts import AccountsModel, auth, g
from backend.models.notifications import NotificationsModel
from backend.models.posts import PostsModel
from backend.utils import CustomException, lock
from flask_restful import Resource, reqparse
from werkzeug.datastructures import FileStorage


class Posts(Resource):
    @auth.login_required()
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("limit", type=int, required=False, nullable=False, location="args")
        parser.add_argument("offset", type=int, required=False, nullable=False, location="args")
        data = parser.parse_args()
        posts = PostsModel.get_groups(data["limit"], data["offset"])
        if posts:
            return {"posts": [post.json() for post in posts]}, 200
        return {"message": "No posts were found"}, 404

    @auth.login_required()
    def post(self, id=None):
        parser = reqparse.RequestParser()
        parser.add_argument("text", type=str, required=True, nullable=False)
        parser.add_argument("parent_id", type=int, required=False, nullable=True)
        data = parser.parse_args()

        with lock.lock:
            new_post = PostsModel(data["text"])
            acc = AccountsModel.get_by_username(g.user.username)
            new_post.account = acc
            parent_id = data["parent_id"]
            addN = False
            if parent_id != None:
                parent = PostsModel.get_by_id(parent_id)
                new_post.parent = parent
                if parent.account_id != acc.id:
                    noti = NotificationsModel(2)
                    noti.account_id2 = acc.id
                    noti.account_id = parent.account_id
                    noti.post_id = new_post.id  # Retorna el comentari
                    try:
                        noti.save_to_db()
                    except Exception:
                        noti.rollback()
                        return {"message": "An error occurred with post-Notification"}, 500

            if id:
                new_post.community = 1
            try:
                new_post.save_to_db()
            except Exception:
                return {"message": "An error occurred creating the post"}, 500
            return {"post": new_post.json()}, 201

    @auth.login_required()
    def put(self, id):
        with lock.lock:
            post = PostsModel.get_by_id(id)
            if post is None:
                return {"message": "No post was found"}, 404
            if post.account.username != g.user.username:
                return {"message": "Unauthorized!"}, 403

            parser = reqparse.RequestParser()
            parser.add_argument("text", type=str, required=False, nullable=False, default=post.text)
            parser.add_argument("parent_id", type=int, required=False, nullable=True, default=post.parent_id)
            parser.add_argument("archived", type=int, required=False, nullable=False, default=post.archived)
            parser.add_argument("community", type=int, required=False, nullable=False, default=post.community)
            data = parser.parse_args()

            try:
                post.text = data["text"]
                post.parent = PostsModel.get_by_id(data["parent_id"])
                post.archived = data["archived"]
                post.community = data["community"]
                post.save_to_db()
            except Exception:
                return {"message": "An error occurred updating the post"}, 500
            return {"message": "Post updated successfully!"}, 200

    @auth.login_required()
    def delete(self, id):
        post = PostsModel.get_by_id(id)
        if post is None:
            return {"message": "No post was found"}, 404
        if post.account.username != g.user.username:
            return {"message": "Unauthorized!"}, 403
        try:
            post.account.deleteFile(post.image1)
            post.account.deleteFile(post.image2)
            post.account.deleteFile(post.video1)
            post.delete_from_db()
        except Exception:
            return {"message": "An error occurred deleting the post"}, 500
        return {"message": "Post deleted successfully!"}, 200


class UserPosts(Resource):
    @auth.login_required()
    def get(self, user=None):
        parser = reqparse.RequestParser()
        parser.add_argument("limit", type=int, required=False, nullable=False, default=100, location="args")
        parser.add_argument("offset", type=int, required=False, nullable=False, default=0, location="args")
        parser.add_argument("archived", type=int, required=False, nullable=True, default=None, location="args")
        data = parser.parse_args()
        same = 0
        account = g.user if user is None else AccountsModel.get_by_username(user)
        if not account:
            return {"message": "User not found"}, 404
        if account.id != g.user.id:
            same = 1
            if data["archived"]:
                return {"message": "Archived posts can only be seen by the owner"}, 403

        posts = PostsModel.get_groups_by_account(account.id, data["limit"], data["offset"], data["archived"], same)
        if posts:
            return {"posts": [post.json() for post in posts]}, 200
        return {"message": "No posts were found"}, 404


class Comments(Resource):
    @auth.login_required()
    def get(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument("limit", type=int, required=True, nullable=False, location="args")
        parser.add_argument("offset", type=int, required=True, nullable=False, location="args")
        data = parser.parse_args()
        posts = PostsModel.get_comments(data["limit"], data["offset"], id)
        if posts:
            return {"comments": [post.json() for post in posts]}, 200
        return {"message": "No comments were found"}, 404


class Post(Resource):
    @auth.login_required()
    def get(self, id):
        post = PostsModel.get_by_id(id)
        if post is None:
            return {"message": "No post was found"}, 404
        return {"post": post.json()}, 200


class PostsFiles(Resource):
    allowed_extensions = {
        "image": ["png", "jpg", "jpeg", "webp", "gif"],
        "video": ["mp4", "webm", "mov"],
    }

    @classmethod
    def get_allowed_extension(cls, filename, fileType):
        ext = filename.rsplit(".", 1)[1].lower() if "." in filename else ""
        if ext in cls.allowed_extensions[fileType]:
            return ext
        raise CustomException("Invalid file extension.")

    def save_file(self, account, file, fileType):
        extension = self.get_allowed_extension(file.filename, fileType)
        unique_file_path = account.getUniqueFilePath(extension)
        file.save(unique_file_path)
        account.saveFileToStorage(unique_file_path)
        return unique_file_path

    def update_account_post_file(self, account, post, file, post_file):
        f = self.save_file(account, file, post_file[:-1])
        account.deleteFile(getattr(post, post_file))
        setattr(post, post_file, f)
        post.save_to_db()

    @auth.login_required()
    def put(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument("image1", type=FileStorage, location="files", required=False, default=None)
        parser.add_argument("image2", type=FileStorage, location="files", required=False, default=None)
        parser.add_argument("video1", type=FileStorage, location="files", required=False, default=None)
        data = parser.parse_args()

        account = g.user
        image1, image2, video1 = data["image1"], data["image2"], data["video1"]

        post = PostsModel.get_by_id(id)
        if post is None:
            return {"message": "No post was found!"}, 404
        if post.account.username != account.username:
            return {"message": "Unauthorized!"}, 403

        with lock.lock:
            try:
                if image1 and image1.filename:
                    self.update_account_post_file(account, post, image1, "image1")
                if image2 and image2.filename:
                    self.update_account_post_file(account, post, image2, "image2")
                if video1 and video1.filename:
                    self.update_account_post_file(account, post, video1, "video1")
            except CustomException as e:
                return {"message": str(e)}, 400
            except Exception:
                return {"message": "Failed to update the post."}, 500

        return {"post": post.json()}, 200

    @auth.login_required()
    def delete(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument("image1", type=int, required=False, nullable=False, default=0, location="args")
        parser.add_argument("image2", type=int, required=False, nullable=False, default=0, location="args")
        parser.add_argument("video1", type=int, required=False, nullable=False, default=0, location="args")
        data = parser.parse_args()

        account = g.user
        post = PostsModel.get_by_id(id)
        if post is None:
            return {"message": "No post was found!"}, 404
        if post.account.username != account.username:
            return {"message": "Unauthorized!"}, 403

        with lock.lock:
            try:
                if data["image1"]:
                    account.deleteFile(post.image1)
                    post.image1 = ""
                if data["image2"]:
                    account.deleteFile(post.image2)
                    post.image2 = ""
                if data["video1"]:
                    account.deleteFile(post.video1)
                    post.video1 = ""
                post.save_to_db()
            except Exception:
                return {"message": "Failed to update the post."}, 500

        return {"post": post.json()}, 200
