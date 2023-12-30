<script>
  // needed node.js installations: npm i rxjs
  // added tailwind css see: https://tailwindcss.com/docs/guides/sveltekit

  import { onMount, onDestroy } from 'svelte';
  import { interval } from 'rxjs';
  import { switchMap } from 'rxjs/operators';

  let events;
  let subscription;

  // function to fetch data from serverside API at /db/+server.js 
  const fetchData = async () => {
    console.log('fetching data...');
    const res = await fetch('/db');
    if (res.ok) {
      return await res.json();
    } else {
      console.error('Error:', res.statusText);
    }
  };

  // on component mount, use rxjs to trigger fetchData every 10 seconds
  onMount(() => {
    subscription = interval(10000)
      .pipe(switchMap(() => fetchData()))
      .subscribe((result) => {
        events = result;
      });

    // assign unsubscribe function to variable to be used on component unmount
    return () => {
      subscription.unsubscribe();
    };
  });

  // on component unmount, unsubscribe from rxjs interval
  onDestroy(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });
</script>

<!--- <h1 class="font-bold">Calendar Widget</h1>-->  
<!-- display events if they exist -->
{#if events}

  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    event name
                </th>
                <th scope="col" class="px-6 py-3">
                    start time
                </th>
                <th scope="col" class="px-6 py-3">
                    duration
                </th>
                <th scope="col" class="px-6 py-3">
                    EndIn
                </th>
                <th scope="col" class="px-6 py-3">
                    StartIn
                </th>
                <th scope="col" class="px-6 py-3">
                  location
              </th>
            </tr>
        </thead>
        <tbody>

          {#each events.sort((a, b) => a.start.localeCompare(b.start)) as event}
            <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {event.name}
                </th>
                <td class="px-6 py-4">
                  {event.start}
                </td>
                <td class="px-6 py-4">
                  {event.duration}
                </td>
                <td class="px-6 py-4">
                  {event.endin ? event.endin : ''}
                </td>
                <td class="px-6 py-4">
                  {event.startin ? event.startin : ''}
                </td>
                <td class="px-6 py-4">
                  {event.location ? event.location : ''}
              </td>
            </tr>
             {/each}
        </tbody>
    </table>
  </div>

  {:else}
    <!-- loading spinner when condition is false -->
    <ul class="max-w-md space-y-2 p-5 text-gray-500 list-inside dark:text-gray-400">
      <li class="flex items-center">
          <div role="status">
              <svg aria-hidden="true" class="w-5 h-5 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
              <span class="sr-only">Loading...</span>
          </div>
          loading events
      </li>
  </ul>
{/if} 



  