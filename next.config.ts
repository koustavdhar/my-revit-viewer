import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Speckle packages use subpath imports like `#lodash`; map them for Next/Turbopack.
  transpilePackages: ["@speckle/viewer", "@speckle/shared", "@speckle/objectloader2"],
  turbopack: {
    resolveAlias: {
      "#lodash": "lodash-es",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "#lodash": "lodash-es",
    };
    return config;
  },
};

export default nextConfig;
