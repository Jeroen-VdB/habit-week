<script lang="ts">
	import { onMount } from 'svelte';
	import { Cloud, CloudOff, Loader2, LogIn } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { googleDrive } from '$lib/googleDrive';
	import { habitStore } from '$lib/stores/habits';
	import { get } from 'svelte/store';
	import { trackEvent, ANALYTICS_EVENTS } from '$lib/analytics';

	let syncStatus: 'idle' | 'syncing' | 'error' | 'offline' = 'offline';
	let lastSynced: Date | null = null;
	let isAuthenticated = false;

	onMount(() => {
		isAuthenticated = googleDrive.isAuthenticated;
		if (isAuthenticated) {
			syncStatus = 'idle';
			// Load last sync time from localStorage
			const stored = localStorage.getItem('lastSynced');
			if (stored) {
				lastSynced = new Date(stored);
			}
		}
	});

	function getTimeSinceSync() {
		if (!lastSynced) return 'Never';

		const seconds = Math.floor((Date.now() - lastSynced.getTime()) / 1000);
		if (seconds < 60) return 'Just now';
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
		if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
		return `${Math.floor(seconds / 86400)}d ago`;
	}

	async function handleAuth() {
		try {
			const success = await googleDrive.authenticate();
			if (success) {
				isAuthenticated = true;
				syncStatus = 'idle';
				trackEvent(ANALYTICS_EVENTS.GOOGLE_AUTH_SUCCESS);
				// Auto-sync after auth
				await handleSync();
			}
		} catch (error) {
			console.error('Auth error:', error);
			syncStatus = 'error';
			trackEvent(ANALYTICS_EVENTS.GOOGLE_AUTH_ERROR);
		}
	}

	async function handleSync() {
		if (!isAuthenticated) {
			await handleAuth();
			return;
		}

		syncStatus = 'syncing';

		try {
			// Get current habits data
			const habits = get(habitStore);

			// Save to Google Drive
			await googleDrive.saveData({
				habits,
				lastUpdated: new Date().toISOString(),
			});

			lastSynced = new Date();
			localStorage.setItem('lastSynced', lastSynced.toISOString());
			syncStatus = 'idle';
			trackEvent(ANALYTICS_EVENTS.GOOGLE_SYNC_SUCCESS);
		} catch (error) {
			console.error('Sync error:', error);
			syncStatus = 'error';
			trackEvent(ANALYTICS_EVENTS.GOOGLE_SYNC_ERROR);
		}
	}

	async function handleLoad() {
		if (!isAuthenticated) return;

		syncStatus = 'syncing';

		try {
			const data = await googleDrive.loadData();
			if (data && data.habits) {
				// Load habits into store
				Object.entries(data.habits).forEach(([key, habits]) => {
					habitStore.updateSlot(key, habits as any);
				});

				lastSynced = new Date();
				localStorage.setItem('lastSynced', lastSynced.toISOString());
				syncStatus = 'idle';
			}
		} catch (error) {
			console.error('Load error:', error);
			syncStatus = 'error';
		}
	}
</script>

<div class="bg-background/80 flex items-center gap-2 rounded-lg border p-2 backdrop-blur-sm">
	{#if !isAuthenticated}
		<LogIn class="text-muted-foreground h-4 w-4" />
		<span class="text-muted-foreground text-sm">Sign in to sync</span>
		<Button variant="ghost" size="sm" on:click={handleAuth}>Connect Google Drive</Button>
	{:else if syncStatus === 'syncing'}
		<Loader2 class="text-muted-foreground h-4 w-4 animate-spin" />
		<span class="text-muted-foreground text-sm">Syncing...</span>
	{:else if syncStatus === 'error'}
		<CloudOff class="text-destructive h-4 w-4" />
		<span class="text-destructive text-sm">Sync error</span>
		<Button variant="ghost" size="sm" on:click={handleSync}>Retry</Button>
	{:else}
		<Cloud class="h-4 w-4 text-green-600" />
		<span class="text-muted-foreground text-sm">{getTimeSinceSync()}</span>
		<div class="flex gap-1">
			<Button variant="ghost" size="sm" on:click={handleSync} disabled={syncStatus === 'syncing'}>
				Save
			</Button>
			<Button variant="ghost" size="sm" on:click={handleLoad} disabled={syncStatus === 'syncing'}>
				Load
			</Button>
		</div>
	{/if}
</div>
