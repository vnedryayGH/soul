import sys, os
print('CWD=', os.getcwd())
print('sys.path[0]=', sys.path[0])
sys.path.insert(0, '.')
try:
    import app
    print('app package OK:', hasattr(app, '__path__'))
except Exception as e:
    print('app import FAIL:', repr(e))
try:
    import app.services
    print('services package OK:', hasattr(app.services, '__path__'))
except Exception as e:
    print('services import FAIL:', repr(e))
try:
    import app.services.delivery_guard as dg
    print('delivery_guard OK:', hasattr(dg, 'verify_before_reply'))
except Exception as e:
    print('delivery_guard FAIL:', repr(e))
try:
    import app.routers.soul as soul
    print('soul router import OK')
except Exception as e:
    print('soul router import FAIL:', repr(e))


