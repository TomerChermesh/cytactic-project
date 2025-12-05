class ItemNotFoundError(Exception):
    pass

class ItemAlreadyExistsError(Exception):
    pass

class InvalidTaskStatusError(Exception):
    pass

class InvalidTaskTypeError(Exception):
    pass

class InvalidDaysLimitError(Exception):
    pass
