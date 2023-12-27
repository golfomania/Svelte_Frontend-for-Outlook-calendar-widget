<script>
  // needed node.js installations: npm i rxjs

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

<h1>Calendar Widget</h1>  
<!-- display events if they exist -->
{#if events}
  <ul>
    {#each events as event}
      <li>{event.name}</li>
    {/each}
  </ul>
{/if}
  