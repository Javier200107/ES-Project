from backend.models.accounts import AccountsModel, auth, g
from backend.models.notifications import NotificationsModel
from flask_restful import Resource, reqparse


class Notification(Resource):
    @auth.login_required()
    def delete(self, id):
        noti = NotificationsModel.get_by_id(id)
        if noti:
            if noti.account_id == g.user.id:
                try:
                    noti.delete_from_db()
                except:
                    return {"message": "An error occurred deleting the Notification"}, 500
                return {"message": "Notification deleted successfully!"}, 200
            else:
                return {"message": "Unauthorized!"}, 403

        else:
            return {"message": "No Notification was found"}, 404


class NotificationList(Resource):
    @auth.login_required()
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument("limit", type=int, required=False, nullable=False, location="args")
        parser.add_argument("offset", type=int, required=False, nullable=False, location="args")
        id = g.user.id
        data = parser.parse_args()
        notis = NotificationsModel.get_groups(data["limit"], data["offset"], id)
        if notis:
            return {"notifications": [n.json() for n in notis]}, 200
        else:
            return {"message": "No notifications were found"}, 404

    @auth.login_required()
    def delete(self):
        id = g.user.id
        try:
            NotificationsModel.delete_by_acc_id(id)
        except Exception:
            return {"message": "An error occurred deleting the Notifications"}, 500
        return {"message": "Notifications deleted successfully!"}, 200
