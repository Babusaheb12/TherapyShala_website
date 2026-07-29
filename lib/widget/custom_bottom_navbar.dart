import 'package:flutter/material.dart';
import '../Home/Dashboard/Dashboard.dart';
import '../Home/Search/Search.dart';
import '../Home/MyBooking/MyBooking.dart';
import '../Home/Favorite/FavoriteScreen.dart';
import '../Home/AccountScreen/AccountScreen.dart';
import '../utils/flutter_color_themes.dart';

class MainScreenWithBottomNav extends StatefulWidget {
  MainScreenWithBottomNav({super.key});

  @override
  State<MainScreenWithBottomNav> createState() =>
      _MainScreenWithBottomNavState();
}

class _MainScreenWithBottomNavState extends State<MainScreenWithBottomNav> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFAFAFC),
      body: _buildBody(),
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }

  Widget _buildBody() {
    switch (_currentIndex) {
      case 0:
        return DashboardScreen();
      case 1:
        return SearchScreen();
      case 2:
        return MyBookingScreen();
      case 3:
        return FavoriteScreen();
      case 4:
        return AccountScreen();
      default:
        return DashboardScreen();
    }
  }
}

class CustomBottomNavBarItem {
  final IconData icon;
  final IconData? activeIcon;
  final String label;

  CustomBottomNavBarItem({
    required this.icon,
    this.activeIcon,
    required this.label,
  });
}

class CustomBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final List<CustomBottomNavBarItem>? items;
  final Color? activeColor;
  final Color? inactiveColor;
  final Color? centerButtonColor;
  final VoidCallback? onCenterTap;

  CustomBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    this.items,
    this.activeColor,
    this.inactiveColor,
    this.centerButtonColor,
    this.onCenterTap,
  });

  @override
  Widget build(BuildContext context) {
    final navItems = items ?? [
      CustomBottomNavBarItem(
        icon: Icons.home_outlined,
        activeIcon: Icons.home_rounded,
        label: 'Home',
      ),
      CustomBottomNavBarItem(
        icon: Icons.search_rounded,
        activeIcon: Icons.search_rounded,
        label: 'Search',
      ),
      CustomBottomNavBarItem(
        icon: Icons.shopping_bag_outlined,
        activeIcon: Icons.shopping_bag_rounded,
        label: '',
      ),
      CustomBottomNavBarItem(
        icon: Icons.favorite_outline_rounded,
        activeIcon: Icons.favorite_rounded,
        label: 'Favorite',
      ),
      CustomBottomNavBarItem(
        icon: Icons.person_outline_rounded,
        activeIcon: Icons.person_rounded,
        label: 'Account',
      ),
    ];

    final effectiveActiveColor = activeColor ?? AppColors.textPrimary;
    final effectiveInactiveColor = inactiveColor ?? Color(0xFFB0B3BC);
    final effectiveCenterColor = centerButtonColor ?? AppColors.primary;
    final centerIndex = navItems.length ~/ 2;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 20,
            spreadRadius: 2,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Container(
          height: 72,
          padding: EdgeInsets.symmetric(horizontal: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(navItems.length, (index) {
              final isSelected = currentIndex == index;
              final isCenter = index == centerIndex;
              final item = navItems[index];

              if (isCenter) {
                return GestureDetector(
                  onTap: () {
                    if (onCenterTap != null) {
                      onCenterTap!();
                    } else {
                      onTap(index);
                    }
                  },
                  child: Container(
                    width: 52,
                    height: 52,
                    margin: EdgeInsets.only(bottom: 6),
                    decoration: BoxDecoration(
                      color: effectiveCenterColor,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: effectiveCenterColor.withValues(alpha: 0.35),
                          blurRadius: 12,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Icon(
                        isSelected ? (item.activeIcon ?? item.icon) : item.icon,
                        color: Colors.white,
                        size: 26,
                      ),
                    ),
                  ),
                );
              }

              return InkWell(
                onTap: () => onTap(index),
                splashColor: Colors.transparent,
                highlightColor: Colors.transparent,
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        isSelected ? (item.activeIcon ?? item.icon) : item.icon,
                        color: isSelected ? effectiveActiveColor : effectiveInactiveColor,
                        size: 24,
                      ),
                      SizedBox(height: 4),
                      Text(
                        item.label,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                          color: isSelected ? effectiveActiveColor : effectiveInactiveColor,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}
