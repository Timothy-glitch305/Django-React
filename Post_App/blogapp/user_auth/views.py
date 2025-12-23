from .serializers import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework import generics
from .models import CustomUser
# Create your views here.
class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]