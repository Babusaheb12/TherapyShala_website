import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';

import '../../widget/custom_snackbar.dart';
import 'AccountSecurity.dart';
import 'PersonalData.dart';
import 'TermConditionsAndprivacyPolicy.dart';
import 'aboutApp.dart';
import 'helpCenter.dart';
import 'pushNotification.dart';

class AccountScreen extends StatefulWidget {
  AccountScreen({super.key});

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  String _cacheSize = "88 MB";

  void _clearCache() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(Constants.clearCache),
        content: Text(Constants.areYouSureClearCache),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(Constants.cancel),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _cacheSize = Constants.omb;
              });
              Navigator.pop(context);
              CustomSnackBar.show(
                context,
                message: Constants.cacheCleared,
                icon: Icons.check_circle_rounded,
                backgroundColor: AppColors.add,
              );
            },
            child: Text(Constants.clear, style: TextStyle(color: AppColors.primary)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 10),

              // Profile Header Card
              Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFFFCE4EC),
                      image: DecorationImage(
                        image: NetworkImage(
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
                        ),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          Constants.guest,
                          style: FTextStyle.tittle(context),
                        ),
                        SizedBox(height: 4),
                        Text(
                          Constants.guestEmail,
                          style: FTextStyle.desc(context),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              SizedBox(height: 24),

              // Section 1: Personal Info
              _buildSectionTitle(Constants.personalInfo),
              SizedBox(height: 8),
              _buildMenuItem(
                icon: Icons.person_outline_rounded,
                title: Constants.personalData,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => PersonalDataScreen(),
                    ),
                  );
                },
              ),
              _buildMenuItem(
                icon: Icons.shield_outlined,
                title: Constants.accountSecurity,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => AccountSecurityScreen(),
                    ),
                  );
                },
              ),

              SizedBox(height: 12),

              // Section 2: General
              _buildSectionTitle(Constants.general),
              SizedBox(height: 6),
              _buildMenuItem(
                icon: Icons.notifications_none_rounded,
                title: Constants.pushNotification,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => PushNotificationScreen(),
                    ),
                  );
                },
              ),
              _buildMenuItem(
                icon: Icons.delete_outline_rounded,
                title: Constants.clearCache,
                trailingText: _cacheSize,
                onTap: _clearCache,
              ),

              SizedBox(height: 12),

              // Section 3: About
              _buildSectionTitle(Constants.about),
              SizedBox(height: 6),
              _buildMenuItem(
                icon: Icons.help_outline_rounded,
                title: Constants.helpCenter,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => HelpCenterScreen(),
                    ),
                  );
                },
              ),
              _buildMenuItem(
                icon: Icons.lock_outline_rounded,
                title: Constants.privacyPolicy,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => TermConditionsAndPrivacyPolicyScreen(
                        isPrivacyPolicy: true,
                      ),
                    ),
                  );
                },
              ),
              _buildMenuItem(
                icon: Icons.info_outline_rounded,
                title: Constants.aboutApp,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => AboutAppScreen(),
                    ),
                  );
                },
              ),
              _buildMenuItem(
                icon: Icons.gavel_rounded,
                title: Constants.termsAndCondition,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => TermConditionsAndPrivacyPolicyScreen(
                        isPrivacyPolicy: false,
                      ),
                    ),
                  );
                },
              ),

              SizedBox(height: 14),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: FTextStyle.header(context),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    String? trailingText,
  }) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      dense: true,
      visualDensity: VisualDensity(vertical: -3),
      minVerticalPadding: 0,
      onTap: onTap,
      leading: Icon(
        icon,
        color: AppColors.textPrimary,
        size: 20,
      ),
      title: Text(
        title,
        style: FTextStyle.tittle(context),
      ),
      trailing: trailingText != null
          ? Text(
              trailingText,
              style: FTextStyle.desc(context),
            )
          : Icon(
              Icons.chevron_right_rounded,
              color: AppColors.textSecondary,
              size: 20,
            ),
    );
  }
}
