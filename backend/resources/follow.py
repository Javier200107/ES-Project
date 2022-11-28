
from backend.lock import lock
from flask_restful import Resource, reqparse

from backend.models.TextPostModel import TextPostModel
from backend.models.accounts import AccountsModel, auth, g


from flask_restful import Resource


class Follow(Resource):
    @auth.login_required()
    def get(self, account1,account2=None):
        if(not account2):
            acc2= g.user
        else:
            acc2 = AccountsModel.get_by_id(account2)
        acc1 = AccountsModel.get_by_id(account1)
        if(acc1 and acc2):
            follows= acc1.followers
            if(follows):
                for i in follows:
                    if(i.id==acc2.id):
                        return {'message': "Account1 with Id [{}] follow Account2 with Id [{}] ".format(account1,account2)}, 200 if i else 404
                return {'message': "Account1 with Id [{}] doesn't follow Account2 with id [{}] ".format(account1,account2)}, 404
            else:
                return {'message': "Account with Id [{}] doesn't follow any account".format(account1)}, 404

        else:
            return {'message': "Account with Id [{}] or [{}] doesn't exists".format(account1,account2)}, 404
    @auth.login_required()
    def post(self,account1,account2=None):
        acc1 = AccountsModel.get_by_id(account1)
        if (not account2):
            acc2 = g.user
        else:
            acc2 = AccountsModel.get_by_id(account2)
        if (acc1 and acc2):
            follow = acc1.followers
            following = acc2.following
            if (follow):
                for i in follow:
                    if (i.id == acc2.id):
                        # es podria fer que si ja el segueix el deixi de seguir
                        return {'message': "Account1 with Id [{}] already follows Account2 [{}]".format(account1,
                                                                                                        account2)}, 404
            follow.append(acc2)
            try:
                acc1.save_to_db()
                acc2.save_to_db()
                return {"Account": acc1.json()}, 200
            except:
                acc1.rollback()
                acc2.rollback()
                return {"message": "An error occurred inserting the Follow."}, 500
        else:
            return {'message': "Account1 with Id [{}] or Account2 with Id [{}] doesn't exists".format(account1,
                                                                                                      account2)}, 404
    @auth.login_required()
    def delete(self,account1,account2=None):
        with lock.lock:
            acc1 = AccountsModel.get_by_id(account1)
            if (not account2):
                acc2 = g.user
            else:
                acc2 = AccountsModel.get_by_id(account2)
            if (acc1 and acc2):
                follow = acc1.followers
                following = acc2.following
                if (follow):
                    for i in follow:
                        if (i.id == acc2.id):
                            follow.remove(i)
                            try:
                                acc1.save_to_db()
                                acc2.save_to_db()
                                return {'Account': acc1.json()}, 200
                            except:
                                 acc1.rollback()
                                 acc2.rollback()
                                 return {"message": "An error occurred deleting the Follow."}, 500
                    return {'message': "Follow with accountId [{}] and accountId [{}] doesn't exists".format(account1,account2)}, 404
                else:
                    return {'message': "Account with Id [{}] doesn't have follows".format(account1)}, 404

            else:
                return {'message': "Account1 with Id [{}] or Account2 with Id [{}] doesn't exists".format(account1,account2)}, 404


class ListFollows(Resource):
    @auth.login_required()
    def get(self,accountid=None):
        if(accountid==None):
            account =g.user
        else:
            account = AccountsModel.get_by_id(accountid)
        if (account):
            return {'ListFollows': [f.json() for f in account.followers]}, 200
        else:
            return {'message': "Account with id [{}] doesn't exists".format(account)}, 404

class ListFollowing(Resource):
    @auth.login_required()
    def get(self,accountid=None):
        if(accountid==None):
            account =g.user
        else:
            account = AccountsModel.get_by_id(accountid)
        if (account):
            return {'ListFollowing': [f.json() for f in account.following]}, 200
        else:
            return {'message': "Account with id [{}] doesn't exists".format(account)}, 404







