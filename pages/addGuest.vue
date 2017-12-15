<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 sm8>
      <v-card>
        <v-card-title class="headline">Add Guest</v-card-title>
        <v-card-text>
          <p>Fill out all the required fields:</p>
          <v-form>
            <v-container fluid>
              <v-layout row>
                <v-flex xs6 md2>
                  <v-menu offset-y>
                    <v-btn slot="activator">Title</v-btn>
                    <v-list>
                      <v-list-tile v-for="item in items" :key="item.title" @click="">
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-flex>
                <v-flex xs12 ml-2 md3>
                  <v-text-field
                    name="firstName"
                    label="First Name*"
                    id="firstName"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 ml-2 md3>
                  <v-text-field
                    name="lastName"
                    label="Last Name*"
                    id="lastName"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm8>
                  <v-text-field
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat>Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    data: () => ({
      items: [
        { title: 'Mrs' },
        { title: 'Mr' },
        { title: 'Miss' },
        { title: 'Ms' },
        { title: 'Dr' },
        { title: 'Rev' },
        { title: 'Other' }
      ]
    })
  }
</script>
