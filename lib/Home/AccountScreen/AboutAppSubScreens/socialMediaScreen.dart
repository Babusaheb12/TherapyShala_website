import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';

class SocialMediaScreen extends StatelessWidget {
  SocialMediaScreen({super.key});

  final List<Map<String, dynamic>> _socials = [
    {
      "name": "Instagram",
      "handle": "@therapyshala_app",
      "icon": Icons.camera_alt_rounded,
      "color": Color(0xFFE1306C),
    },
    {
      "name": "Facebook",
      "handle": "TherapyShala Official",
      "icon": Icons.facebook_rounded,
      "color": Color(0xFF1877F2),
    },
    {
      "name": "YouTube",
      "handle": "TherapyShala Wellness",
      "icon": Icons.play_circle_fill_rounded,
      "color": Color(0xFFFF0000),
    },
    {
      "name": "Twitter / X",
      "handle": "@therapyshala",
      "icon": Icons.alternate_email_rounded,
      "color": Colors.black,
    },
    {
      "name": "LinkedIn",
      "handle": "TherapyShala Technologies",
      "icon": Icons.work_rounded,
      "color": Color(0xFF0A66C2),
    },
  ];

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
          Constants.followUsOnSocialMedia,
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                Constants.connectWithUs,
                style: FTextStyle.header(context),
              ),
              SizedBox(height: 6),
              Text(
                Constants.followTherapyShalaAcrossSocialMedia,
                style: FTextStyle.desc(context)
              ),

              SizedBox(height: 20),

              Column(
                children: _socials.map((item) {
                  return GestureDetector(
                    onTap: () {
                      CustomSnackBar.show(
                        context,
                        message: "Opening ${item["name"]} link...",
                        icon: Icons.open_in_new_rounded,
                        backgroundColor: AppColors.primary,
                      );
                    },
                    child: Container(
                      margin: EdgeInsets.only(bottom: 12),
                      padding: EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Color(0xFFEBEBEB)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: (item["color"] as Color).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              item["icon"] as IconData,
                              color: item["color"] as Color,
                              size: 22,
                            ),
                          ),
                          SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item["name"] as String,
                                  style: FTextStyle.tittle(context)
                                ),
                                SizedBox(height: 2),
                                Text(
                                  item["handle"] as String,
                                  style: FTextStyle.desc(context)
                                ),
                              ],
                            ),
                          ),
                          Icon(
                            Icons.arrow_forward_ios_rounded,
                            color: AppColors.textSecondary,
                            size: 16,
                          ),
                        ],
                      ),
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
