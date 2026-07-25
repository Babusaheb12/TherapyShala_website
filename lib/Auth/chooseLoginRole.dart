import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../utils/ImageAssets.dart';
import '../utils/constants.dart';
import '../utils/flutter_color_themes.dart';
import '../utils/flutter_font_style.dart';

enum LoginRole { customer, therapist }

class chooseLoginRole extends StatefulWidget {
  const chooseLoginRole({super.key, this.onRoleSelected});

  final ValueChanged<LoginRole>? onRoleSelected;

  @override
  State<chooseLoginRole> createState() => _chooseLoginRoleState();
}

class _chooseLoginRoleState extends State<chooseLoginRole> {
  void _selectRole(LoginRole role) => widget.onRoleSelected?.call(role);

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light.copyWith(
        statusBarColor: Colors.transparent,
        systemNavigationBarColor: const Color(0xFF0D0D12),
        systemNavigationBarIconBrightness: Brightness.light,
      ),
      child: Scaffold(
        // backgroundColor: const Color(0xFF0D0D12),
        body: Stack(
          fit: StackFit.expand,
          children: [
            // Background Image
            Image.asset(
              ImageAssets.chooseRoleBackground,
              fit: BoxFit.cover,
            ),

            // Soft Gradient Overlay
            const DecoratedBox(
              decoration: BoxDecoration(
                // gradient: LinearGradient(
                //   begin: Alignment.topCenter,
                //   end: Alignment.bottomCenter,
                //   colors: [
                //     Color(0x330D0D12),
                //     Color(0x8A0D0D12),
                //     Color(0xF50D0D12),
                //   ],
                //   stops: [0.0, 0.45, 0.78],
                // ),
              ),
            ),

            SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Column(
                  children: [
                    const Spacer(flex: 2),

                    // Top App Logo Header
                    Container(
                      width: 64,
                      height: 64,
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.2),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.25),
                            blurRadius: 20,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.asset(
                          ImageAssets.appIcon,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                     SizedBox(height: 8),

                    // Brand Title
                    Text(
                      Constants.appName,
                      style: FTextStyle.chooseRoleButton(context).copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 20,
                      ),
                    ),
                    const SizedBox(height: 5),

                    // Underline accent
                    Container(
                      width: 48,
                      height: 4,
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Title
                    Text(
                      Constants.chooseRoleTitle,
                      textAlign: TextAlign.center,
                      style: FTextStyle.chooseRoleTitle(context).copyWith(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.4,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Subtitle
                    Text(
                      Constants.chooseRoleSubtitle,
                      textAlign: TextAlign.center,
                      style: FTextStyle.chooseRoleSubtitle(context).copyWith(
                        color: const Color(0xFFC0BAC0),
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Customer Role Card
                    _RoleCard(
                      titleLine1: 'Continue as Customer',
                      subtitleLine1: 'Book wellness at your',
                      subtitleLine2: 'convenience',
                      icon: Icons.person_rounded,
                      iconBgColor: AppColors.primary.withValues(alpha: 0.16),
                      iconColor: AppColors.primary,
                      onTap: () => _selectRole(LoginRole.customer),
                    ),
                    const SizedBox(height: 16),

                    // Therapist Role Card
                    _RoleCard(
                      titleLine1: 'Continue as Therapist',
                      subtitleLine1: 'Manage your clients',
                      subtitleLine2: 'and services',
                      icon: Icons.spa_rounded,
                      iconBgColor: const Color(0xFFF4B6C5).withValues(alpha: 0.16),
                      iconColor: const Color(0xFFF4B6C5),
                      onTap: () => _selectRole(LoginRole.therapist),
                    ),

                    const Spacer(flex: 4),

                    // Footer Terms of Service
                    RichText(
                      textAlign: TextAlign.center,
                      text: TextSpan(
                        style: FTextStyle.chooseRoleSubtitle(context).copyWith(
                          color: Colors.white60,
                          fontSize: 13,
                        ),
                        children: const [
                          TextSpan(text: 'By continuing, you agree to our '),
                          TextSpan(
                            text: 'Terms of Service',
                            style: TextStyle(
                              color: Colors.white70,
                              decoration: TextDecoration.underline,
                              decorationColor: Colors.white70,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RoleCard extends StatefulWidget {
  const _RoleCard({
    required this.titleLine1,
    required this.subtitleLine1,
    required this.subtitleLine2,
    required this.icon,
    required this.iconBgColor,
    required this.iconColor,
    required this.onTap,
  });

  final String titleLine1;
  final String subtitleLine1;
  final String subtitleLine2;
  final IconData icon;
  final Color iconBgColor;
  final Color iconColor;
  final VoidCallback onTap;

  @override
  State<_RoleCard> createState() => _RoleCardState();
}

class _RoleCardState extends State<_RoleCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return AnimatedScale(
      scale: _isPressed ? 0.98 : 1.0,
      duration: const Duration(milliseconds: 150),
      curve: Curves.easeOutCubic,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: widget.onTap,
              onTapDown: (_) => setState(() => _isPressed = true),
              onTapUp: (_) => setState(() => _isPressed = false),
              onTapCancel: () => setState(() => _isPressed = false),
              borderRadius: BorderRadius.circular(22),
              splashColor: Colors.white.withValues(alpha: 0.1),
              highlightColor: Colors.white.withValues(alpha: 0.05),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 18,
                  vertical: 18,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E171B).withValues(alpha: 0.72),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.14),
                    width: 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.25),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    // Icon Badge
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: widget.iconBgColor,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(
                        widget.icon,
                        color: widget.iconColor,
                        size: 27,
                      ),
                    ),
                    const SizedBox(width: 16),

                    // Title & Subtitle Text
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.titleLine1,
                            style: FTextStyle.chooseRoleButton(context).copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${widget.subtitleLine1}\n${widget.subtitleLine2}',
                            style: FTextStyle.chooseRoleSubtitle(context).copyWith(
                              color: const Color(0xFFB5AFB3),
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Chevron Right Icon
                    const Icon(
                      Icons.chevron_right_rounded,
                      color: Colors.white54,
                      size: 22,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
