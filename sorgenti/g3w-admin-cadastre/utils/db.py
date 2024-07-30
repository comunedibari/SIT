from django.db import connections

def truncateTable(tableName, connection='default'):
    """
    Perform query on db anche get next sequence value form db
    """
    if isinstance(tableName, list):
        tableName = ', '.join(tableName)

    cur = connections[connection].cursor()
    res = cur.execute("TRUNCATE {}".format(tableName))
    return res



