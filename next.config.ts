import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    // TODO: Убрать в дальнейшем, когда проект будет завершён
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
