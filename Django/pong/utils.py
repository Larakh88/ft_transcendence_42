from datetime import datetime , timezone
from django.contrib.sessions.models  import Session
from pong.models import associate_session_with_user, ft_User

def is_active(user):
    sk = user.session_key

    if sk:
        ssk  = Session.objects.filter( session_key=sk) #qset 
        if ssk:
            session  = Session.objects.get( session_key=ssk[0]) 
    
            expire_date = session.expire_date
            now = datetime.now(expire_date.tzinfo) # to avoid "can't compare offset-naive and offset-aware datetimes"

            if session.expire_date > now:
                return True
            else:
                return False
    else:
        return False