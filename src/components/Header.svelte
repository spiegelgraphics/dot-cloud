<script>
    export let title = '';
    export let subtitle = '';
</script>


<div class="header">
    {#if title}
        <div class="title">{title}</div>
    {/if}
    {#if subtitle}
        <div class="subtitle">{subtitle}</div>
    {/if}
</div>


<style>
  .header {
    margin-bottom: 0.75rem;
  }

  .title {
    padding-bottom: 0.0625rem;
    font-size: 20px;
  }

  .subtitle {
    font-size: 16px;
  }
</style>
