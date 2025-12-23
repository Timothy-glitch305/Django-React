from rest_framework import serializers
from .models import Post, Comment


class CommentSerializer(serializers.ModelSerializer):
    can_edit = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()
    author_name = serializers.CharField(source="author.username", read_only=True)
    author_picture = serializers.ImageField(source="author.profile_image", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "content", "likes_count", "post", "author", "author_name", "author_picture", "created_at", "can_edit", "liked_by_me"]
        extra_kwargs = {
            "author": {"read_only": True},
            "post": {"read_only": True}
        }


    def get_can_edit(self, obj):
        request = self.context.get("request")
        return request and request.user == obj.author
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_liked_by_me(self, obj):
        user = self.context["request"].user
        return user.is_authenticated and obj.likes.filter(id=user.id).exists()
    
    


class PostSerializer(serializers.ModelSerializer):
    can_edit = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()
    author_name = serializers.ReadOnlyField(source="author.username")
    author_picture = serializers.ImageField(source="author.profile_image")

    class Meta:
        model = Post
        fields = ["id", "caption", "content", "likes_count", "author_picture", "author_name", "author", "created_at", "can_edit", "liked_by_me"]
        extra_kwargs = {"author": {"read_only": True}}


    def get_can_edit(self, obj):
        request = self.context["request"]
        return request and request.user == obj.author
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_liked_by_me(self, obj):
        user = self.context["request"].user
        return user.is_authenticated and obj.likes.filter(id=user.id).exists()