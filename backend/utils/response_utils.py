def success(data=None, message="Success", status_code=200):
    return {"success": True, "message": message, "data": data}
