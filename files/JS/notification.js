window.addEventListener('DOMContentLoaded', () => {
    // Path pointing to your json folder
    fetch('/files/Json/Messages.json')
        .then(response => {
            if (!response.ok) throw new Error('Could not load Messages.json');
            return response.json();
        })
        .then(data => {
            const notification = document.getElementById('custom-notification');
            const messageElement = document.getElementById('notification-message');

            // Helper to normalize a field into an array of entries.
            const normalize = (field) => {
                if (field == null) return [];
                if (Array.isArray(field)) return field;
                if (typeof field === 'object') return Object.values(field);
                return [field];
            };

            const getTextAndDuration = (entry) => {
                if (entry == null) return { text: '', duration: 3000 };
                if (typeof entry === 'string') return { text: entry, duration: data.displayDuration || 3000 };
                // entry is expected to be an object { text, duration }
                return {
                    text: entry.text || '',
                    duration: typeof entry.duration === 'number' ? entry.duration : (data.displayDuration || 3000)
                };
            };

            // Escape HTML to prevent injection.
            const escapeHtml = (str) => String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');

            // Convert literal backslash-n sequences to real newlines, then normalize CRLF/CR/LF to <br>
            const renderText = (text) => {
                let raw = String(text || '');
                raw = raw.replace(/\\n/g, '\n');
                return escapeHtml(raw).replace(/\r\n|\r|\n/g, '<br>');
            };

            const showOnce = async (text, duration) => {
                messageElement.innerHTML = renderText(text);
                notification.classList.add('show');
                await new Promise(resolve => setTimeout(resolve, duration));
                notification.classList.remove('show');
            };

            // Run display logic async so we can await sequential messages.
            (async () => {
                try {
                    // First: show configured notificationText entries (if any), sequentially.
                    // This ensures the user sees any authored messages on page load.
                    const notifList = normalize(data.notificationText);
                    if (notifList.length > 0) {
                        for (const item of notifList) {
                            const { text, duration } = getTextAndDuration(item);
                            await showOnce(text, duration);
                            // small pause between messages
                            await new Promise(r => setTimeout(r, 200));
                        }
                    } else {
                        // No explicit notifications on load; nothing to show immediately.
                        console.debug('No notificationText entries to show on load');
                    }

                    // Then: schedule periodic random notifications (do NOT show one immediately)
                    if ('randNotificationText' in data) {
                        const randList = normalize(data.randNotificationText);
                        if (randList.length > 0) {
                            // Determine interval (default ~5 minutes). Support randomIntervalMinutes or randomIntervalMs.
                            let randIntervalMs = 5 * 60 * 1000; // default 5 minutes
                            if ('randomIntervalMinutes' in data) {
                                const m = Number(data.randomIntervalMinutes);
                                if (!Number.isNaN(m) && m > 0) randIntervalMs = m * 60000;
                            } else if ('randomIntervalMs' in data) {
                                const ms = Number(data.randomIntervalMs);
                                if (!Number.isNaN(ms) && ms > 0) randIntervalMs = ms;
                            }

                            const showRandom = async () => {
                                const pick = randList[Math.floor(Math.random() * randList.length)];
                                const { text, duration } = getTextAndDuration(pick);
                                try {
                                    await showOnce(text, duration);
                                } catch (err) {
                                    console.error('Error showing random notification', err);
                                }
                            };

                            // Start the periodic timer but wait randIntervalMs before first run so it won't fire on load
                            setTimeout(() => {
                                showRandom();
                                setInterval(showRandom, randIntervalMs);
                                console.debug('[notification] started periodic random notifications every', randIntervalMs, 'ms');
                            }, randIntervalMs);
                        }
                    }
                } catch (err) {
                    console.error('Notification display error:', err);
                }
            })();
        })
        .catch(error => console.error('Notification error:', error));
});
