<script setup lang="ts">
const titleCase = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1)
const toggleIcon = ref('left')
const tab = ref<string>()

const variants = [ 'elevated', 'flat', 'tonal', 'outlined', 'text', 'plain' ]
const colors = [ 'primary', 'secondary', 'tertiary', 'error', 'warning', 'success', 'info' ]
const icons = [ 'mdi-heart', 'mdi-star', 'mdi-cached', 'mdi-thumb-up', 'mdi-account-circle' ]
const sizes = [
  {size: 'x-small', label: 'x-small'},
  {size: 'small', label: 'small'},
  {size: undefined, label: 'normal'},
  {size: 'large', label: 'large'},
  {size: 'x-large', label: 'x-large'},
]
const cardVariants = [
  { variant: undefined, label: 'default' },
  { variant: 'outlined', label: 'outlined' },
  { variant: 'tonal', label: 'tonal' }
]
const chipVariants = [
  { variant: undefined, label: 'default' },
  { variant: 'outlined', label: 'outlined' },
  { variant: 'elevated', label: 'elevated' },
  { variant: 'text', label: 'text' },
  { variant: 'plain', label: 'plain' },
]
</script>

<template>
  <v-container>
    <h1>Actions</h1>
    <h2>Button Colors</h2>
    <v-row v-for="variant in variants" :key="`btn-color-variant--${variant}`">
      <v-col>
        <div class="d-flex align-center flexrow">
          <span><strong>{{ titleCase(variant) }}</strong></span>
          <v-btn v-for="color in colors" :key="`btn-color--${color}`" :color="color" :variant="variant">
            {{ titleCase(color) }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <h2>Button Icons</h2>
    <v-row>
      <v-col>
        <div class="d-flex flexspace">
          <v-btn v-for="icon in icons" :key="`btn-icon--${icon}`" :icon="icon" />
        </div>
      </v-col>
    </v-row>

    <h2>Button Sizes</h2>
    <v-row>
      <v-col>
        <div class="d-flex flexspace">
          <v-btn v-for="sizeObj in sizes" :key="`btn-size--${sizeObj.size}`" :size="sizeObj.size">
            {{ sizeObj.label }}
          </v-btn>
          <v-btn v-for="(sizeObj, index) in sizes" :key="`btn-size-icon--${sizeObj.size}`" :icon="icons[index]" :size="sizeObj.size" />
        </div>
      </v-col>
    </v-row>

    <h2>Button Groups</h2>
    <v-row>
      <v-col>
        <v-btn-toggle v-model="toggleIcon" variant="outlined">
          <v-btn :rounded="0" value="left">
            <span class="hidden-sm-and-down">Left</span>

            <v-icon end>
              mdi-format-align-left
            </v-icon>
          </v-btn>

          <v-btn :rounded="0" value="center">
            <span class="hidden-sm-and-down">Center</span>

            <v-icon end>
              mdi-format-align-center
            </v-icon>
          </v-btn>

          <v-btn :rounded="0" value="right">
            <span class="hidden-sm-and-down">Right</span>

            <v-icon end>
              mdi-format-align-right
            </v-icon>
          </v-btn>

          <v-btn :rounded="0" value="justify">
            <span class="hidden-sm-and-down">Justify</span>

            <v-icon end>
              mdi-format-align-justify
            </v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <h1>Badges</h1>
    <h2>Dots</h2>
    <v-row>
      <v-col cols="12" md="4">
        <v-toolbar title="Application">
          <v-btn stacked>
            <v-badge color="error" dot>
              <v-icon icon="mdi-newspaper-variant-outline" />
            </v-badge>
          </v-btn>
          <v-btn stacked>
            <v-badge color="error" dot>
              <v-icon icon="mdi-post" />
            </v-badge>
          </v-btn>
          <v-btn stacked>
            <v-icon icon="mdi-login" />
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>

    <h2>Inline</h2>
    <v-row>
      <v-col>
        <v-list border max-width="256">
          <v-list-item
            link
            prepend-icon="mdi-inbox-arrow-down"
            title="Inbox"
          >
            <template v-slot:append>
              <v-badge
                color="error"
                content="6"
                inline
              />
            </template>
          </v-list-item>

          <v-list-item
            link
            prepend-icon="mdi-send"
            title="Sent Mail"
          />

          <v-list-item
            link
            prepend-icon="mdi-delete"
            title="Trash"
          >
            <template v-slot:append>
              <v-badge
                color="info"
                content="12"
                inline
              />
            </template>
          </v-list-item>

          <v-list-item
            link
            prepend-icon="mdi-alert-circle"
            title="Spam"
          />
        </v-list>
      </v-col>
    </v-row>

    <h1>Cards</h1>
    <v-row>
      <v-col v-for="cardVariant in cardVariants" :key="`card-variant--${cardVariant.label}`" cols="12" md="4">
        <v-card
          loading
          :title="`${titleCase(cardVariant.label)} variant`"
          subtitle="Subtitle"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!"
          :variant="cardVariant.variant"
        >
          <v-card-actions>
            <v-btn>Click Me</v-btn>
            <v-btn size="small" color="surface-variant" variant="text" icon="mdi-heart" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <h1>Tabs</h1>
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-tabs v-model="tab" bg-color="primary">
            <v-tab value="one">Item One</v-tab>
            <v-tab value="two">Item Two</v-tab>
            <v-tab value="three">Item Three</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="one">One</v-window-item>
              <v-window-item value="two">Two</v-window-item>
              <v-window-item value="three">Three</v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <h1>Chips</h1>
    <v-row v-for="chipVariant in chipVariants" :key="`chip-variant--${chipVariant.label}`">
      <v-col>
        <div class="d-grid">
          <span><strong>{{ titleCase(chipVariant.label) }}</strong></span>
          <v-chip
            v-for="color in colors" :key="`chip--${color}`"
            class="ma-2"
            :color="color"
            :variant="chipVariant.variant"
          >
            {{ titleCase(color) }}
          </v-chip>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.flexrow button,
.flexrow span {
  flex: 1;
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
  }
}

.flexspace button {
  margin-right: 1rem;
}

.d-grid {
  display: grid !important;
  
  grid-template-columns: repeat(8, 1fr);
  grid-column-gap: 1rem;

  grid-template-rows: 1;
  row-gap: 1rem;

  span, .v-chip {
    grid-row: 1 / span 1;
    align-self: center;
    justify-content: center;
  }
}
</style>