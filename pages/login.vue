<template>
  <v-layout row align-center justify-center>
    <v-flex xs12 md6>
      <v-card>
        <v-card-title class="headline">Login</v-card-title>
        <v-card-text>
          <p>Login to view and manage your guests.</p>
          <v-container fluid>
            <v-layout row>
              <v-flex xs12 sm8>
                <v-text-field
                  name="username"
                  label="Username"
                  id="username"
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat>Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
