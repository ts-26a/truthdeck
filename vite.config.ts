import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@/': `${__dirname}/src/`, // path.join(__dirname, "src/") でも可
      },
    },
    define: {
      // ref: https://github.com/thlorenz/parse-link-header/blob/f380d3f99de4a5411b2d7f8da6069bb7529cbf4a/index.js#L7
      'process.env.PARSE_LINK_HEADER_MAXLEN': JSON.stringify(
        env.PARSE_LINK_HEADER_MAXLEN,
      ),
      'process.env.PARSE_LINK_HEADER_THROW_ON_MAXLEN_EXCEEDED': JSON.stringify(
        env.PARSE_LINK_HEADER_THROW_ON_MAXLEN_EXCEEDED,
      ),
    },
  };
});
