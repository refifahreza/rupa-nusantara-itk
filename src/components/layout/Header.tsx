import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { isAuthenticated, getCurrentUser, logoutUser } from '../../utils/auth';

// Define navigation param types
type RootStackParamList = {
  Home: undefined;
  Main: undefined;
  Translate: { word?: string };
  Stories: { storyId?: string };
  Explore: undefined;
  Quiz: undefined;
  Auth: undefined;
  Login: undefined;
  StudentDashboard: undefined;
  TeacherDashboard: undefined;
};

interface HeaderProps {
  title?: string;
  showMobileMenu?: boolean;
  showNotifications?: boolean;
  showNavigation?: boolean;
  activeNavItem?: string;
  customNavItems?: { title: string; route: string; isActive: boolean; icon?: string }[];
  showBack?: boolean;
  onBackPress?: () => void;
}

const Header = ({
  title = 'Rupa Nusantara',
  showMobileMenu = true,
  showNotifications = false,
  showNavigation = false,
  activeNavItem = 'Home',
  customNavItems,
  showBack = false,
  onBackPress
}: HeaderProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  
  // Check if in desktop mode
  const isDesktop = width > 768;
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userData, setUserData] = useState<any>(isLoggedIn ? getCurrentUser() : null);
  
  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUserData(null);
    setAccountMenuVisible(false);
    setMobileMenuVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };
  
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };
  
  // Default nav items if no custom ones provided - updated to match bottom tabs
  const defaultNavItems = [
    { title: 'Beranda', route: 'Home', isActive: activeNavItem === 'Home', icon: 'home' },
    { title: 'Terjemahan', route: 'Translate', isActive: activeNavItem === 'Translate', icon: 'translate' },
    { title: 'Jelajah Daerah', route: 'Explore', isActive: activeNavItem === 'Explore', icon: 'map' },
    { title: 'Cerita & Warisan', route: 'Stories', isActive: activeNavItem === 'Stories', icon: 'book' }
  ];
  
  const navItems = customNavItems || defaultNavItems;
  
  const renderNavItem = (item: { title: string, route: string, isActive: boolean, icon?: string }) => (
    <TouchableOpacity 
      key={item.title} 
      style={[styles.navItem, item.isActive && styles.activeNavItem]}
      onPress={() => {
        if (isLoggedIn) {
          const userRole = userData?.role;
          if (item.route === 'Home' && (userRole === 'student' || userRole === 'teacher')) {
            // If logged in and on home, go to appropriate dashboard
            navigation.navigate(userRole === 'teacher' ? 'TeacherDashboard' : 'StudentDashboard');
          } else {
            // Otherwise navigate to the specified route
            navigation.navigate(item.route as any);
          }
        } else {
          // For non-logged in users, navigate directly
          navigation.navigate(item.route as any);
        }
      }}
    >
      {item.icon && isDesktop && (
        <MaterialIcons name={item.icon as any} size={18} color={item.isActive ? Colors.primary : Colors.text} style={styles.navItemIcon} />
      )}
      <Text style={[styles.navItemText, item.isActive && styles.activeNavItemText]}>{item.title}</Text>
    </TouchableOpacity>
  );
  
  // Account menu dropdown
  const AccountMenu = () => (
    <View style={styles.accountMenu}>
      {isLoggedIn ? (
        // Logged in user menu
        <>
          <View style={styles.accountMenuHeader}>
            <View style={styles.accountAvatar}>
              <Text style={styles.accountAvatarText}>
                {userData?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.accountName}>{userData?.name || 'User'}</Text>
              <Text style={styles.accountEmail}>{userData?.email || 'user@example.com'}</Text>
            </View>
          </View>
          <View style={styles.menuDivider} />
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setAccountMenuVisible(false);
              if (userData?.role === 'teacher') {
                navigation.navigate('TeacherDashboard');
              } else {
                navigation.navigate('StudentDashboard');
              }
            }}
          >
            <Ionicons name="grid-outline" size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Profil Saya</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Pengaturan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="bookmark-outline" size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Tersimpan</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={[styles.menuItemText, { color: "#FF3B30" }]}>Keluar</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Guest user menu
        <>
          <View style={styles.accountMenuHeader}>
            <View style={styles.accountAvatar}>
              <Ionicons name="person-outline" size={24} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.accountName}>Tamu</Text>
              <Text style={styles.accountEmail}>Silakan masuk atau daftar</Text>
            </View>
          </View>
          <View style={styles.menuDivider} />
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setAccountMenuVisible(false);
              navigation.navigate('Login');
            }}
          >
            <Ionicons name="log-in-outline" size={20} color={Colors.primary} />
            <Text style={[styles.menuItemText, { color: Colors.primary }]}>Masuk</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setAccountMenuVisible(false);
              navigation.navigate('Login');
            }}
          >
            <Ionicons name="person-add-outline" size={20} color={Colors.text} />
            <Text style={styles.menuItemText}>Daftar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
  
  // Mobile Menu
  const MobileMenu = () => (
    <View style={styles.mobileMenuContainer}>
      <TouchableOpacity
        style={styles.mobileMenuBackdrop}
        activeOpacity={1}
        onPress={() => setMobileMenuVisible(false)}
      />
      <View style={styles.mobileMenu}>
        <View style={styles.mobileMenuHeader}>
          <View style={styles.avatarContainer}>
            {isLoggedIn ? (
              <Text style={styles.avatarText}>{userData?.name?.charAt(0) || 'U'}</Text>
            ) : (
              <Ionicons name="person-outline" size={24} color={Colors.primary} />
            )}
          </View>
          <View>
            <Text style={styles.userName}>{isLoggedIn ? userData?.name || 'User' : 'Tamu'}</Text>
            <Text style={styles.userEmail}>
              {isLoggedIn ? userData?.email || 'user@example.com' : 'Silakan masuk atau daftar'}
            </Text>
          </View>
        </View>
        
        <View style={styles.menuDivider} />
        
        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <TouchableOpacity 
            key={item.title}
            style={styles.menuItem}
            onPress={() => {
              setMobileMenuVisible(false);
              navigation.navigate(item.route as any);
            }}
          >
            <MaterialIcons 
              name={item.icon as any || 'circle'} 
              size={24} 
              color={item.isActive ? Colors.primary : Colors.text} 
            />
            <Text style={[styles.menuItemText, item.isActive && { color: Colors.primary }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
        
        <View style={styles.menuDivider} />
        
        {isLoggedIn ? (
          // Logged in menu items
          <>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMobileMenuVisible(false);
                if (userData?.role === 'teacher') {
                  navigation.navigate('TeacherDashboard');
                } else {
                  navigation.navigate('StudentDashboard');
                }
              }}
            >
              <Ionicons name="grid-outline" size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setMobileMenuVisible(false)}
            >
              <Ionicons name="person-outline" size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>Profil Saya</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setMobileMenuVisible(false)}
            >
              <Ionicons name="settings-outline" size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>Pengaturan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setMobileMenuVisible(false)}
            >
              <Ionicons name="help-circle-outline" size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>Bantuan</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                handleLogout();
                setMobileMenuVisible(false);
              }}
            >
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <Text style={[styles.menuItemText, { color: "#FF3B30" }]}>Keluar</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Guest menu items
          <>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMobileMenuVisible(false);
                navigation.navigate('Login');
              }}
            >
              <Ionicons name="log-in-outline" size={24} color={Colors.primary} />
              <Text style={[styles.menuItemText, { color: Colors.primary }]}>Masuk</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMobileMenuVisible(false);
                navigation.navigate('Login');
              }}
            >
              <Ionicons name="person-add-outline" size={24} color={Colors.text} />
              <Text style={styles.menuItemText}>Daftar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
  
  return (
    <>
      {/* Desktop or Mobile Header */}
      {isDesktop ? (
        <View style={styles.desktopHeader}>
          <View style={styles.row}>
            <TouchableOpacity 
              style={styles.logoContainer} 
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.logo}>🌊</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>

          {/* Always show navigation in desktop mode */}
          <View style={styles.desktopNav}>
            {navItems.map(item => renderNavItem(item))}
          </View>

          <View style={styles.row}>
            {!isLoggedIn && (
              <>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.headerButtonText}>Daftar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerButtonPrimary}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.headerButtonTextPrimary}>Masuk</Text>
                </TouchableOpacity>
              </>
            )}
            
            {showNotifications && (
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color={Colors.text} />
              </TouchableOpacity>
            )}

            {/* Account button with dropdown */}
            <View>
              <TouchableOpacity
                style={styles.accountButton}
                onPress={() => setAccountMenuVisible(!accountMenuVisible)}
              >
                {isLoggedIn ? (
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{userData?.name?.charAt(0) || 'U'}</Text>
                  </View>
                ) : (
                  <Ionicons name="person-circle" size={28} color={Colors.primary} />
                )}
              </TouchableOpacity>
              {accountMenuVisible && <AccountMenu />}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {showBack ? (
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={handleBack}
                >
                  <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.logoContainer} 
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text style={styles.logo}>🌊</Text>
                </TouchableOpacity>
              )}
              
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
            
            <View style={styles.headerRight}>
              {showNotifications && (
                <TouchableOpacity style={styles.notificationButton}>
                  <Ionicons name="notifications-outline" size={24} color={Colors.text} />
                </TouchableOpacity>
              )}
              
              {showMobileMenu && !isDesktop && !showBack && (
                <TouchableOpacity 
                  style={styles.menuButton}
                  onPress={() => setMobileMenuVisible(true)}
                >
                  <Ionicons name="menu-outline" size={24} color={Colors.text} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
      
      {/* Mobile menu dropdown */}
      {mobileMenuVisible && <MobileMenu />}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 1000,
    width: '100%',
  },
  desktopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItemIcon: {
    marginRight: 6,
  },
  activeNavItem: {
    backgroundColor: Colors.primary + '20', // 20% opacity
  },
  navItemText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeNavItemText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 4,
  },
  headerButtonPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  headerButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  headerButtonTextPrimary: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Account button and menu
  accountButton: {
    marginLeft: 12,
    padding: 4,
  },
  accountMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    width: 240,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 16,
    zIndex: 1000,
  },
  accountMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  accountAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  accountName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  accountEmail: {
    fontSize: 12,
    color: Colors.lightText,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 14,
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logo: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  mobileMenuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  mobileMenuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mobileMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: '100%',
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  mobileMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.lightText,
  },
  mobileMenuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
  },
  notificationButton: {
    padding: 8,
    marginRight: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default Header; 