import { createRestAPIClient } from 'masto';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useCookies } from 'react-cookie';

async function verifyCredentials(accessToken: string) {
  const masto = createRestAPIClient({
    url: 'https://truthsocial.com/',
    accessToken,
  });
  return await masto.v1.accounts.verifyCredentials();
}

export default function Login() {
  const [accessToken, setAccessToken] = useState('');
  const [_cookies, setCookie, _removeCookie] = useCookies();
  return (
    <div className="h-screen w-screen center bg-gray-200">
      <div className="w-[600px] max-w-[80%] aspect-square vstack bg-white rounded-xl">
        <span className="max-w-[60%]">
          アクセストークンを入力してログインして下さい
        </span>
        <input
          type="text"
          placeholder="access token"
          value={accessToken}
          onChange={(e) => {
            setAccessToken(e.target.value);
          }}
          className="shadow appearance-none border rounded w-3/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          className="bg-gray-900 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => {
            const toastId = toast.loading('Please wait...');
            verifyCredentials(accessToken)
              .then((account) => {
                toast.update(toastId, {
                  render: 'Login as @' + account.username,
                  type: 'success',
                  isLoading: false,
                });
                setCookie('access_token', accessToken, {
                  secure: true,
                  maxAge: 31536000,
                  sameSite: 'strict',
                });
                setCookie('user_id', account.id, {
                  secure: true,
                  maxAge: 31536000,
                  sameSite: 'strict',
                });
                location.href = '/home';
              })
              .catch((e) => {
                toast.update(toastId, {
                  render: 'An unexpected error occurred',
                  type: 'error',
                  isLoading: false,
                });
                console.error(e);
              });
          }}
        >
          ログイン
        </button>
        <a
          href="/how_to_get_access_token"
          className="text-blue-500 hover:underline hover:text-orange-400"
        >
          🔗アクセストークンの取得方法
        </a>
      </div>
      <ToastContainer />
    </div>
  );
}
