import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopackのルートディレクトリを明示的に設定
  turbopack: {
    root: path.resolve(__dirname),
  },
  // サーバー外部パッケージとして@libsql/clientを設定
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
