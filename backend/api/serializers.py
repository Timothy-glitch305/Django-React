from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "author", "created_at", "title", "content"]
        extra_kwargs = {"author": {"read_only": True}}
        """extra_kwargs bezieht sich nicht auf den restlichen Input des Frontends sondern auf die weitere Gestaltung und Regelung der Felder (extra_argumente für Felder)"""