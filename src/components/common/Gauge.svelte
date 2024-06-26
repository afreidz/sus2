<script lang="ts">
  import { roundAbsoluteToTwoDecimalPlaces } from "@/helpers/numbers";

  let gap = 100;
  let vbw = 10000;
  let vbh = vbw / 2;
  let radius = 4500;
  let className = "";
  let thickness = 800;
  let hideLabels = false;
  let fullscreen = false;
  let hideFullscreen = false;
  let fullscreenContent: HTMLDivElement;
  let fullscreenDialog: HTMLDialogElement;
  let svg: SVGSVGElement | undefined = undefined;
  let gauge: HTMLElement | undefined = undefined;
  let differential: number | undefined = undefined;
  let differentialSubtitle: string | undefined = undefined;

  function circumference(rad: number) {
    return 2 * Math.PI * rad;
  }

  let scores:
    | [[number, number?]]
    | [[number, number?], [number, number?]]
    | [[number, number?], [number, number?], [number, number?]];

  let keys: [string?, string?, string?] = [];

  const strokes = [
    "stroke-sus-primary-40",
    "stroke-sus-primary-45",
    "stroke-sus-primary-60",
  ];

  const fills = ["bg-sus-primary-40", "bg-sus-primary-45", "bg-sus-primary-60"];

  const bgs = ["bg-bg-neutral", "bg-neutral-100"];
  let activeBg = bgs[0];

  $: if (fullscreenDialog) fullscreenDialog.showModal();

  $: if (fullscreen && fullscreenContent && gauge) {
    fullscreenContent.innerHTML = "";
    fullscreenContent.appendChild(gauge.cloneNode(true));
  }

  $: if (!fullscreen && fullscreenContent) {
    fullscreenContent.innerHTML = "";
  }

  export {
    svg,
    vbh,
    vbw,
    gap,
    keys,
    gauge,
    radius,
    scores,
    thickness,
    hideLabels,
    differential,
    hideFullscreen,
    className as class,
    differentialSubtitle,
  };
</script>

<div class={`relative @container ${className ?? ""}`} bind:this={gauge}>
  {#if !fullscreen && !hideFullscreen}
    <button
      on:click={() => (fullscreen = true)}
      class="btn btn-sm btn-outline absolute top-1 right-1 border-current text-current"
    >
      <iconify-icon icon="mdi:arrow-expand-all"></iconify-icon>
    </button>
  {/if}
  {#if !hideLabels}
    <ul class="">
      {#each keys as key, i}
        <li class="flex gap-2 items-center text-[clamp(11px,_2.5cqi,_18px)]">
          <i class="w-4 h-4 rounded {fills[i]}"></i>
          {key}
        </li>
      {/each}
    </ul>
  {/if}
  <svg
    bind:this={svg}
    style="width: 100%; transform: rotate(180deg);"
    viewBox="0 0 {vbw} {vbh}"
  >
    {#each scores as scoreset, i}
      {#if scoreset}
        {@const sorted = [...scoreset]
          .sort()
          .reverse()
          .filter((s) => s !== undefined)}
        <g>
          <circle
            r={radius - (thickness + gap) * i}
            cx="50%"
            cy="0%"
            fill="none"
            stroke-dasharray={`${circumference(radius - (thickness + gap) * i) / 2}, ${circumference(radius - (thickness + gap) * i)}`}
            class="stroke-sus-primary-20"
            style="stroke: #d0effb;"
            stroke-width={thickness}
          ></circle>
          {#each sorted as score, z}
            {#if score !== undefined}
              {@const strokeHex = ["#95C4CB", "#67ACB6", "#0A506A"]}
              {@const positive = "#43C478"}
              {@const negative = "#f04259"}
              <circle
                r={radius - (thickness + gap) * i}
                cx="50%"
                cy="0%"
                fill="none"
                style={`stroke: ${
                  z === 0 &&
                  scoreset[1] !== undefined &&
                  scoreset[1] > scoreset[0]
                    ? positive
                    : z === 0 &&
                        scoreset[1] !== undefined &&
                        scoreset[1] < scoreset[0]
                      ? negative
                      : strokeHex[i]
                }`}
                class={strokes[i]}
                class:!stroke-sus-positive-40={z === 0 &&
                  scoreset[1] !== undefined &&
                  scoreset[1] > scoreset[0]}
                class:!stroke-sus-negative-40={z === 0 &&
                  scoreset[1] !== undefined &&
                  scoreset[1] < scoreset[0]}
                stroke-dasharray={`${(score / 100) * (circumference(radius - (thickness + gap) * i) / 2)}, ${circumference(radius - (thickness + gap) * i)}`}
                stroke-width={thickness}
              ></circle>
            {/if}
          {/each}
        </g>
      {/if}
    {/each}
  </svg>
  {#if differential !== undefined}
    <main
      style={`top: ${(thickness / vbh) * scores.length * 100 + (gap / vbh) * (scores.length + 1) * 100}%; margin-top: ${keys.length * 10}px;`}
      class="flex flex-col items-center justify-center absolute bottom-2 left-0 right-0"
    >
      {#if !hideLabels}
        <span class="font-light text-[clamp(11px,_3cqi,_18px)]"
          >Differential</span
        >
      {/if}
      {#if differential < 0}
        <strong class="text-sus-negative-40 leading-none font-black">
          {#if !hideLabels}
            <iconify-icon icon="mdi:arrow-down-bold" class="text-xl"
            ></iconify-icon>
          {/if}
          <span
            class="flex-1"
            class:text-[clamp(11px,_19cqi,_80px)]={hideLabels}
            class:text-[clamp(11px,_10cqi,_80px)]={!hideLabels}
            >{roundAbsoluteToTwoDecimalPlaces(differential)}</span
          >
        </strong>
      {:else}
        <strong class="text-sus-positive-40 leading-none font-black">
          {#if !hideLabels}
            <iconify-icon icon="mdi:arrow-up-bold" class="text-xl"
            ></iconify-icon>
          {/if}
          <span
            class="flex-1"
            class:text-[clamp(11px,_19cqi,_80px)]={hideLabels}
            class:text-[clamp(11px,_10cqi,_80px)]={!hideLabels}
            >{roundAbsoluteToTwoDecimalPlaces(differential)}</span
          >
        </strong>
      {/if}
      {#if differentialSubtitle}
        <span class="text-[clamp(11px,_3cqi,_18px)] font-light"
          >{differentialSubtitle}</span
        >
      {/if}
    </main>
  {/if}
  {#if !hideLabels}
    <footer>
      <ul class="flex">
        {#each scores as scoreset}
          <li
            class="text-[clamp(11px,_2.5cqi,_18px)] font-light text-center"
            style={`width: ${100 / (vbw / (gap + thickness))}%;`}
          >
            {scoreset[1] !== undefined
              ? roundAbsoluteToTwoDecimalPlaces(scoreset[1])
              : roundAbsoluteToTwoDecimalPlaces(scoreset[0])}
          </li>
        {/each}
      </ul>
    </footer>
  {/if}
</div>
{#if fullscreen}
  <dialog
    class="modal"
    bind:this={fullscreenDialog}
    on:close={() => (fullscreen = false)}
  >
    <div class="modal-box bg-neutral w-full max-w-3xl text-neutral-950">
      <div class="modal-actions flex justify-between items-center mb-4">
        <div class="flex flex-1 gap-2">
          <strong class="inline-block mr-2">Background Color: </strong>
          {#each bgs as bg}
            <button
              class:ring-2={bg === activeBg}
              class="rounded-sm border border-neutral-400 ring-sus-primary-60 ring-offset-1 ring-offset-neutral !w-6 !h-6 !aspect-square {bg}"
              on:click={() => (activeBg = bg)}
            ></button>
          {/each}
        </div>
        <form method="dialog" class="flex-none">
          <button class="btn btn-sm btn-ghost">
            <iconify-icon icon="mdi:close"></iconify-icon>
          </button>
        </form>
      </div>
      <div bind:this={fullscreenContent} class="p-10 rounded {activeBg}"></div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
{/if}
