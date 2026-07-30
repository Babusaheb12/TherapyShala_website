import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';

import '../../utils/ImageAssets.dart';
import 'AboutAppSubScreens/accessibilityScreen.dart';
import 'AboutAppSubScreens/developerScreen.dart';
import 'AboutAppSubScreens/feedbackScreen.dart';
import 'AboutAppSubScreens/partnerScreen.dart';
import 'AboutAppSubScreens/rateUsDialog.dart';
import 'AboutAppSubScreens/socialMediaScreen.dart';
import 'AboutAppSubScreens/termsOfUseScreen.dart';
import 'AboutAppSubScreens/visitWebsiteScreen.dart';

class AboutAppScreen extends StatelessWidget {
  AboutAppScreen({super.key});

  final List<String> _menuItems = [
    "Developer",
    "Partner",
    "Accesibility",
    "Terms of Use",
    "Feedback",
    "Rate us",
    "Visit Our Website",
    "Follow us On Social Media",
  ];

  void _onMenuItemTap(BuildContext context, String title) {
    switch (title) {
      case "Developer":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => DeveloperScreen()),
        );
        break;
      case "Partner":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => PartnerScreen()),
        );
        break;
      case "Accesibility":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => AccessibilityScreen()),
        );
        break;
      case "Terms of Use":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => TermsOfUseScreen()),
        );
        break;
      case "Feedback":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => FeedbackScreen()),
        );
        break;
      case "Rate us":
        RateUsDialog.show(context);
        break;
      case "Visit Our Website":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => VisitWebsiteScreen()),
        );
        break;
      case "Follow us On Social Media":
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => SocialMediaScreen()),
        );
        break;
      default:
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Center(
          child: GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Icon(
              Icons.arrow_back,
              color: Colors.black,
              size: 18,
            ),
          ),
        ),
        title: Text(
          Constants.aboutApp,
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            children: [
              SizedBox(height: 10),
              // Logo & App Version
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 68,
                      height: 68,
                      decoration: BoxDecoration(
                        color: Color(0xFFFFF0F3),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Image.asset(
                          ImageAssets.appIcon,
                          width: 40,
                          height: 40,
                          fit: BoxFit.fill,
                        ),
                      ),
                    ),
                    SizedBox(height: 14),
                    Text(
                      Constants.appVersion,
                      style: FTextStyle.header(context),
                    ),
                  ],
                ),
              ),

              SizedBox(height: 28),

              // Menu Items List
              Column(
                children: _menuItems.map((title) {
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                    visualDensity: VisualDensity(vertical: -2),
                    onTap: () => _onMenuItemTap(context, title),
                    title: Text(
                      title,
                      style: FTextStyle.tittle(context),
                    ),
                    trailing: Icon(
                      Icons.chevron_right_rounded,
                      color: AppColors.textSecondary,
                      size: 22,
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
