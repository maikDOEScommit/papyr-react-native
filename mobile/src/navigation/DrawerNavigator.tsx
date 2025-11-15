import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { COLORS } from '../constants/colors';
import BottomTabNavigator from './BottomTabNavigator';
import ShopScreen from '../screens/ShopScreen';
import RulesScreen from '../screens/RulesScreen';
import { useAuth } from '../contexts/AuthContext';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const { user, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <ImageBackground
        source={require('../../assets/PAPYR.jpg')}
        style={styles.drawerBackground}
        imageStyle={{ opacity: 0.15 }}
      >
        {/* User Info */}
        <View style={styles.userSection}>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.divider} />
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('Home')}
          >
            <Text style={styles.menuIcon}>🏠</Text>
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('Shop')}
          >
            <Text style={styles.menuIcon}>🃏</Text>
            <Text style={styles.menuText}>Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate('Rules')}
          >
            <Text style={styles.menuIcon}>📜</Text>
            <Text style={styles.menuText}>Regeln</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={async () => {
              await signOut();
              props.navigation.closeDrawer();
            }}
          >
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={styles.menuText}>Abmelden</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'transparent',
          width: 280,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.5)',
        headerStyle: {
          backgroundColor: COLORS.backgroundPrimary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#2d2e2e',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{
          title: 'PAPYR',
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          title: 'Shop',
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="Rules"
        component={RulesScreen}
        options={{
          title: 'Regeln',
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerBackground: {
    flex: 1,
    backgroundColor: 'rgb(206, 205, 203)',
  },
  userSection: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  userEmail: {
    fontSize: 14,
    color: '#2d2e2e',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#2d2e2e',
    opacity: 0.2,
    marginVertical: 16,
  },
  menuSection: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 28,
  },
  menuText: {
    fontSize: 16,
    color: '#2d2e2e',
    fontWeight: '600',
  },
  logoutItem: {
    marginTop: 8,
  },
});
