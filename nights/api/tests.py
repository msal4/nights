from django.contrib.auth.models import User
from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient


class FileUploadTests(APITestCase):
    """
    Test user upload action.
    """

    def setUp(self) -> None:
        self.client = APIClient()
        self.user = User.objects.create(username='test', password='test', email='test@test.test')
        self.user.save()

    @staticmethod
    def _create_test_file(path):
        f = open(path, 'w')
        f.write('test123455\n')
        f.close()
        f = open(path, 'rb')
        return {'file': f}

    def _upload_file(self):
        url = reverse('fileupload', args=('test', 'test-file.test'))
        data = self._create_test_file('/tmp/test-upload')
        return self.client.put(url, data=data, format='multipart')

    def test_guest_user_cant_upload_file(self):
        """
        Guest users should not be allowed to upload files.
        """
        response = self._upload_file()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

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
