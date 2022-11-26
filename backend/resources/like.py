from backend.lock import lock
from backend.models.accounts import AccountsModel, auth, g
from backend.models.TextPostModel import TextPostModel

from flask_restful import Resource


class Like(Resource):

    @auth.login_required()
    def get(self, account, post):
        post = TextPostModel.get_by_id(post)
        acc = AccountsModel.get_by_username(account)
        if (post):
            accounts = post.accounts_like
            if (accounts):
                for i in accounts:
                    if (i.id == acc.id):
                        return {'message': "Post with Id [{}] have a like from user with Id [{}] ".format(post,
                                                                                                          acc.id)}, 200 if i else 404
                return {'message': "Post with Id [{}] doesn't have likes from user with Id [{}] ".format(post,
                                                                                                         acc.id)}, 404
            else:
                return {'message': "Post with Id [{}] doesn't have likes".format(post)}, 404

        else:
            return {'message': "Post with Id [{}] doesn't exists".format(post)}, 404

    @auth.login_required()
    def post(self, post):
        with lock.lock:
            acc = AccountsModel.get_by_username(g.user.username)
            pt = TextPostModel.get_by_id(post)
            if (acc and post):
                accounts = pt.accounts_like
                if (accounts):
                    for i in accounts:
                        if (i.id == acc.id):
                            return {
                                       'message': "Post with Id [{}] can't have two likes from account with id [{}]".format(
                                           post, acc.id)}, 404
                accounts.append(acc)
                try:
                    pt.save_to_db()
                    return {"Post": pt.json()}, 200
                except:
                    pt.rollback()
                    return {"message": "An error occurred inserting the Like."}, 500
            else:
                return {'message': "Post with Id [{}] or Account with Id [{}] doesn't exists".format(post, acc.id)}, 404

    @auth.login_required()
    def delete(self, post):
        with lock.lock:
            acc = AccountsModel.get_by_username(g.user.username)
            pt = TextPostModel.get_by_id(post)
            if (acc and post):
                accounts = pt.accounts_like
                if (accounts):
                    for i in accounts:
                        if (i.id == acc.id):
                            accounts.remove(i)
                            try:
                                pt.save_to_db()
                                return {'Post': pt.json()}, 200
                            except:
                                pt.rollback()
                                return {"message": "An error occurred deleting the Like."}, 500
                    return {'message': "Like with accountId [{}] and postId [{}] doesn't exists".format(acc.id,
                                                                                                        post)}, 404
                else:
                    return {'message': "Post with Id [{}] doesn't have likes".format(post)}, 404

            else:
                return {'message': "Post with Id [{}] or Account with Id [{}] doesn't exists".format(post, acc.id)}, 404


class ListPostLikes(Resource):
    @auth.login_required()
    def get(self, postid):
        post = TextPostModel.get_by_id(postid)
        if (post):
            return {'ListPostLikes': [like.json() for like in post.accounts_like]}, 200
        else:
            return {'message': "Post with id [{}] doesn't exists".format(postid)}, 404


class ListUserLikes(Resource):
    @auth.login_required()
    def get(self, userid=None):
        if (userid):
            account = AccountsModel.get_by_id(userid)
        else:
            account = g.user
        if (account):
            return {'ListUserLikes': [like.json() for like in account.posts_like]}, 200
        else:
            return {'message': "Account with id [{}] doesn't exists".format(userid)}, 404
            return {'message': "Post with id [{}] doesn't exists".format(postid)}, 404