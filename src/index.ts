import type { AstroIntegration, AstroRenderer, ContainerRenderer, ViteUserConfig } from 'astro';

function getRenderer(): AstroRenderer {
	return {
		name: '@astrojs/preact',
		clientEntrypoint: '@astrojs/preact/client.js',
		serverEntrypoint: '@astrojs/preact/server.js',
	};
}

export default function (compat:boolean): AstroIntegration {
	return {
		name: '@astrojs/preact',
		hooks: {
			'astro:config:setup': ({ addRenderer, updateConfig, command, injectScript }) => {
				const viteConfig: ViteUserConfig = {
					optimizeDeps: {
						include: ['@astrojs/preact/client.js', 'preact', 'preact/jsx-runtime'],
						exclude: ['@astrojs/preact/server.js'],
					},
				};

				if (compat) {
					viteConfig.optimizeDeps!.include!.push(
						'preact/compat',
						'preact/test-utils',
						'preact/compat/jsx-runtime',
					);
					viteConfig.resolve = {
						dedupe: ['preact/compat', 'preact'],
					};
					// noExternal React entrypoints to be bundled, resolved, and aliased by Vite
					viteConfig.ssr = {
						noExternal: ['react', 'react-dom', 'react-dom/test-utils', 'react/jsx-runtime'],
					};
				}

				addRenderer(getRenderer());
				updateConfig({
					vite: viteConfig,
				});
			},
		},
	};
}