from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from api.models import Title


class EpisodeModelTest(APITestCase):
    """
    Test `Episode` model
    """

    def setUp(self):
        self.series = Title(name="Test Series", type='s')
        self.series.save()
        self.season = self.series.seasons.create(index=3)
        self.episode = self.season.episodes.create(index=2)

    def test_episode_name_has_default_value(self):
        self.assertIsNotNone(self.episode.name)

    def test_episode_name_is_overwritable(self):
        name = "The Fire training"
        self.episode.name = name
        self.episode.save()
        self.assertEqual(self.episode.name, name)


class CommonModelTest(APITestCase):
    def setUp(self):
        self.title = Title()
        self.title.save()

    def test_is_new_true_for_recent_titles(self):
        """
        `.is_new` should return true for titles released or updated
         within the last 5 days.
        """
        self.assertTrue(self.title.is_new)

    def test_is_new_false_for_old_titles(self):
        """
        `.is_new` should return false for titles older than
        5 days.
        """
        self.title.updated_at = timezone.now() - timezone.timedelta(30)
        self.title.save()
        self.assertFalse(self.title.is_new)

        self.title.updated_at = timezone.now() - timezone.timedelta(6)
        self.title.save()
        self.assertFalse(self.title.is_new)


class FileUploadTests(APITestCase):
    """
    Test user upload action.
    """
    test_file_path = '/tmp/test-upload'

    def setUp(self) -> None:
        self.client = APIClient()
        self.user = User.objects.create_user(username='test', password='test', email='test@test.test')
        self.user.save()

    @staticmethod
    def _create_test_file(path):
        f = open(path, 'w')
        f.write('test123455\n')
        f.close()
        f = open(path, 'rb')
        return {'file': f}

    def _upload_file(self, path=None):
        url = reverse('fileupload', args=('test', 'test-file.test'))
        data = self._create_test_file(path or self.test_file_path)
        return self.client.put(url, data=data, format='multipart')

    def test_anonymous_user_cant_upload_file(self):
        """
        Guest users should not be allowed to upload files.
        """
        response = self._upload_file()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_user_cant_upload_file(self):
        """
        Logged in users that do not have the permission to upload
        should not be allowed to upload files.
        """
        self.client.force_authenticate(self.user)
        response = self._upload_file()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_upload_file(self):
        """
        Admin users should be allowed to upload files.
        """
        # Make the user an admin
        self.user.is_staff = True
        self.user.save()
        self.client.force_authenticate(self.user)

        response = self._upload_file()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class MyListTests(APITestCase):
    def setUp(self) -> None:
        self.title = Title(name='test title')
        self.title.save()
        self.list_url = reverse('my_list-list')
        self.detail_url = reverse('my_list-detail', args=(self.title.id,))
        self.client = APIClient()

    def _login(self):
        u = User.objects.create_user('test', 'test@test.test', 'test')
        self.client.post(reverse('login'), data={'username': 'test', 'password': 'test'})
        self.client.force_authenticate(u, token=u.auth_token)

    def test_anonymous_user_may_not_access_my_list(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_anonymous_user_may_not_add_to_my_list(self):
        response = self.client.post(self.list_url, data={'id': self.title.id})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_anonymous_user_may_not_remove_from_my_list(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_may_access_my_list(self):
        self._login()
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, [])

    def test_authenticated_user_may_add_to_my_list(self):
        self._login()

        # Should not have a title
        response = self.client.get(self.list_url)
        self.assertNotContains(response, self.title.name)

        response = self.client.post(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response = self.client.post(self.list_url, data={'id': self.title.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Should have a title
        response = self.client.get(self.list_url)
        self.assertContains(response, self.title.name)

    def test_authenticated_user_may_remove_from_my_list(self):
        self._login()

        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Add a title
        self.client.post(self.list_url, data={'id': self.title.id})

        # Delete
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should not have a title
        response = self.client.get(self.list_url)
        self.assertNotContains(response, self.title.name)


class ViewHitTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='test', password='test')
        response = self.client.post(reverse('login'), data={'username': 'test', 'password': 'test'})
        self.client.force_authenticate(self.user, self.user.auth_token)

    def test_user_can_view_his_history(self):
        response = self.client.get(reverse('history-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_title_is_added_to_user_history(self):
        runtime, position = 100, 10

        t = Title.objects.create()
        response = self.client.put(reverse('history-detail', args=(t.id,)),
                                   data={'runtime': runtime, 'playback_position': position})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        w = self.user.watched.get(pk=t.id)
        self.assertEqual(t.id, w.id)
        hit = self.user.viewhit_set.get(topic_id=t.id)
        self.assertEqual(hit.runtime, runtime)
        self.assertEqual(hit.playback_position, position)

    def test_viewhit_update_viewhit_when_watched_more_than_once(self):
        runtime, position = 100, 10

        t = Title.objects.create()
        for i in range(2):
            response = self.client.put(reverse('history-detail', args=(t.id,)),
                                       data={'runtime': runtime, 'playback_position': position})
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        w = self.user.watched.get(pk=t.id)
        self.assertEqual(t.id, w.id)
        hit = self.user.viewhit_set.get(topic_id=t.id)
        self.assertEqual(hit.runtime, runtime)
        self.assertEqual(hit.playback_position, position)
