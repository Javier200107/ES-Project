from backend.models.accounts import AccountsModel, auth, g
from backend.models.notifications import NotificationsModel
from backend.models.posts import PostsModel
from backend.utils import lock
from flask_restful import Resource


class Like(Resource):
    @auth.login_required()
    def get(self, post, account=None):
        pt = PostsModel.get_by_id(post)
        if not account:
            acc = g.user
        else:
            acc = AccountsModel.get_by_username(account)
        if acc and pt:
            accounts = pt.accounts_like
            if accounts:
                for i in accounts:
                    if i.id == acc.id:
                        return {
                            "message": "Post with Id [{}] have a like from user with Id [{}]".format(post, acc.id)
                        }, 200
                return {
                    "message": "Post with Id [{}] doesn't have likes from user with Id [{}]".format(post, acc.id)
                }, 404
            else:
                return {"message": "Post with Id [{}] doesn't have likes".format(post)}, 404
        else:
            return {"message": "Post with Id [{}] or Account [{}] doesn't exist".format(post, account)}, 404

    @auth.login_required()
    def post(self, post):
        with lock.lock:
            acc = AccountsModel.get_by_username(g.user.username)
            pt = PostsModel.get_by_id(post)
            if acc and pt:
                accounts = pt.accounts_like
                if accounts:
                    for i in accounts:
                        if i.id == acc.id:
                            return {
                                "message": "Post with Id [{}] can't have two likes from account with id [{}]".format(
                                    post, acc.id
                                )
                            }, 404
                accounts.append(acc)
                if pt.account_id != acc.id:
                    noti = NotificationsModel(1)
                    noti.account_id2 = acc.id
                    acc2 = AccountsModel.get_by_id(pt.account_id)
                    noti.account_id = acc2.id
                    noti.post_id = post
                    try:
                        noti.save_to_db()
                    except:
                        noti.rollback()
                        return {"message": "An error occurred inserting the Like-Notification."}, 500

                try:
                    pt.save_to_db()
                    return {"Post": pt.json()}, 200
                except:
                    pt.rollback()
                    return {"message": "An error occurred inserting the Like."}, 500
            else:
                return {"message": "Post with Id [{}] or Account doesn't exist".format(post)}, 404

    @auth.login_required()
    def delete(self, post):
        with lock.lock:
            acc = AccountsModel.get_by_username(g.user.username)
            pt = PostsModel.get_by_id(post)
            if acc and pt:
                accounts = pt.accounts_like
                if accounts:
                    for i in accounts:
                        if i.id == acc.id:
                            accounts.remove(i)
                            try:
                                pt.save_to_db()
                                return {"Post": pt.json()}, 200
                            except:
                                pt.rollback()
                                return {"message": "An error occurred deleting the Like."}, 500
                    return {
                        "message": "Like with accountId [{}] and postId [{}] doesn't exists".format(acc.id, post)
                    }, 404
                else:
                    return {"message": "Post with Id [{}] doesn't have likes".format(post)}, 404
            else:
                return {"message": "Post with Id [{}] or Account doesn't exist".format(post)}, 404


class ListPostLikes(Resource):
    @auth.login_required()
    def get(self, postid):
        post = PostsModel.get_by_id(postid)
        if post:
            likes = [like.username for like in post.accounts_like]
            likes_number = len(likes)
            return {"ListPostLikes": likes, "NumberOfLikes": likes_number}, 200
        else:
            return {"message": "Post with id [{}] doesn't exist".format(postid)}, 404


class ListUserLikes(Resource):
    @auth.login_required()
    def get(self, userid=None):
        if userid:
            account = AccountsModel.get_by_id(userid)
        else:
            account = g.user
        if account:
            return {"ListUserLikes": [like.json() for like in account.posts_like if like.archived == 0]}, 200
        else:
            return {"message": "Account with id [{}] doesn't exists".format(userid)}, 404
