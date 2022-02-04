from rest_framework.serializers import ModelSerializer
from law.models import Articles, Laws
from django.urls import reverse
from qdjango.models import Widget
import json


class LawSerializer(ModelSerializer):
    """Law object serializer"""

    class Meta:
        model = Laws
        exclude = []


class CorrelateArticlesSerialiser(ModelSerializer):
    """
    Article object serializer for article correlates
    """

    def to_representation(self, instance):
        ret = super(CorrelateArticlesSerialiser, self).to_representation(instance)

        # add law serilized
        ret['law'] = LawSerializer(instance.law).data
        return ret

    class Meta:
        model = Articles
        exclude = []


class ArticlesSerializer(ModelSerializer):
    """
    Main Article object serializer
    """

    correlate_articles = CorrelateArticlesSerialiser(many=True, read_only=True)

    def to_representation(self, instance):
        ret = super(ArticlesSerializer, self).to_representation(instance)

        # add law serilized
        ret['law'] = LawSerializer(instance.law).data
        return ret

    class Meta:
        model = Articles
        exclude = []


class LawWidgetSerializer(ModelSerializer):
    """
    Serializzer for Qdjango Widget
    """
    def to_representation(self, instance):
        ret = super(LawWidgetSerializer, self).to_representation(instance)
        ret['type'] = instance.widget_type

        body = json.loads(instance.body)
        ret['options'] = body

        ret['options']['lawurl'] = reverse('law-article-api-articles-all')
        return ret

    class Meta:
        model = Widget
        fields = (
            'id',
            'name',
        )