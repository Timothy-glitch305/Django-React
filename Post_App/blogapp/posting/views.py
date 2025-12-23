from .serializer import PostSerializer, CommentSerializer
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .models import Post, Comment
from user_auth.serializers import UserSerializer
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
# Create your views here.

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.action == "likes" or self.action == "unlike":
            return Post.objects.all()
        if self.request.method == "GET":
            return Post.objects.all()
        else:
            return Post.objects.filter(author=self.request.user)
    
    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)
    
    @action(detail=True, methods=["post"], url_path="likes")
    def likes(self, request, pk=None):
        post = self.get_object()
        user = self.request.user

        if user in post.likes.all():
            return Response({"Likes": post.likes.count()}, status=status.HTTP_400_BAD_REQUEST)
        post.likes.add(user)
        return Response({"Likes": post.likes.count()}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["post"], url_path="unlike")
    def unlike(self, request, pk=None):
        post = self.get_object()
        user = self.request.user

        if user in post.likes.all():
            post.likes.remove(user)
            return Response({"Likes": post.likes.count()}, status=status.HTTP_200_OK)
        return Response({"Likes": post.likes.count()}, status=status.HTTP_400_BAD_REQUEST)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter nach Post-ID aus der URL
        post_id = self.kwargs.get('post_pk')
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_pk')
        serializer.save(author=self.request.user, post_id=post_id)


    def perform_update(self, serializer):
        # Nur eigene Kommentare bearbeiten
        if serializer.instance.author != self.request.user:
            raise PermissionDenied("You cannot edit this comment.")
        serializer.save()

    def perform_destroy(self, instance):
        # Nur eigene Kommentare löschen
        if instance.author != self.request.user:
            raise PermissionDenied("You cannot delete this comment.")
        instance.delete()

    
    @action(detail=True, methods=["post"], url_path="likes")
    def likes(self, request, pk=None, post_pk=None):
        comment = self.get_object()
        user = self.request.user

        if user in comment.likes.all():
            return Response({"Likes": comment.likes.count()}, status=status.HTTP_400_BAD_REQUEST)
        comment.likes.add(user)
        return Response({"Likes": comment.likes.count()}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["post"], url_path="unlike")
    def unlike(self, request, pk=None, post_pk=None):
        comment = self.get_object()
        user = self.request.user

        if user in comment.likes.all():
            comment.likes.remove(user)
            return Response({"Likes": comment.likes.count()}, status=status.HTTP_200_OK)
        return Response({"Likes": comment.likes.count()}, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def update(self, request, pk=None):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()