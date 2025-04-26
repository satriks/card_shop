from django.core.cache import cache
from functools import wraps
from rest_framework.response import Response
def cache_response(timeout=60):
    def decorator(func):
        @wraps(func)
        def wrapped(view, *args, **kwargs):
            cache_key = f"{view.__class__.__name__}_{view.request.method}_{args}_{kwargs}"
            cached_response = cache.get(cache_key)
            if cached_response is not None:
                return Response(cached_response)
            response = func(view, *args, **kwargs)
            cache.set(cache_key, response.data, timeout=timeout)
            return response
        return wrapped
    return decorator