<script>
    import { slides } from '../stores/config';
</script>

{#each $slides as { id, body } (id)}
    <section class:show={body}>
        <div class="body">
            <mark>
                {@html body}
            </mark>
        </div>
    </section>
{/each}

<style>
    section {
        max-width: 67%;
        margin: 0 auto;
        padding-top: 50vh;
        padding-bottom: 50vh;
        opacity: 0;
    }

    section.show {
        opacity: 1;
    }

    @media (max-width: 719px) {
        section {
            max-width: calc(100% - 3rem);
        }
    }

    section:first-of-type {
        padding-top: 77vh;
    }

    section:last-of-type {
        padding-bottom: 80vh;
    }

    .body {
        line-height: 2.0;
        user-select: none;
    }

    mark {
        margin: 0 -0.4rem;
        padding: 0.2rem 0.5rem;
        color: white;
        border: none;
        border-radius: 3px;
        background: transparent;
        background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.95),
            rgba(0, 0, 0, 0.90)
        );
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
    }

    :global(mark .s-gi-dot) {
        --s-gi-dot-width: 7px;
        display: inline-block;
        width: var(--s-gi-dot-width);
        height: var(--s-gi-dot-width);
        margin-bottom: calc(var(--s-gi-dot-width) / 4);
        border: none;
        border-radius: 50%;
        background: black;
    }
</style>