import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';

class DeveloperScreen extends StatelessWidget {
  DeveloperScreen({super.key});

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
          Constants.developer,
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
              // Header Card
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Color(0xFFFFF0F3),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primaryLight),
                ),
                child: Column(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.code_rounded,
                        color: Colors.white,
                        size: 32,
                      ),
                    ),
                    SizedBox(height: 12),
                    Text(
                      Constants.developerCompany,
                      style: FTextStyle.header(context)
                    ),
                    SizedBox(height: 4),
                    Text(
                        Constants.developerCompany,
                      style: FTextStyle.desc(context)
                    ),
                  ],
                ),
              ),

              SizedBox(height: 24),

              Text(
                Constants.developerDescription,
                style: FTextStyle.header(context),
              ),
              SizedBox(height: 12),

              _buildInfoRow(context, Icons.business_rounded, Constants.company, Constants.developerCompany),
              Divider(color: Color(0xFFF0F0F3), height: 16),
              _buildInfoRow(context, Icons.email_outlined, Constants.companyEmail, Constants.companyEmail),
              Divider(color: Color(0xFFF0F0F3), height: 16),
              _buildInfoRow(context, Icons.verified_outlined, Constants.appVersions, Constants.version),

              SizedBox(height: 24),

              Text(
                Constants.aboutTeam,
                style: FTextStyle.header(context),
              ),
              SizedBox(height: 8),
              Text(
                Constants.aboutTeamDescription,
                style: FTextStyle.desc(context)
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(BuildContext context, IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 20),
        SizedBox(width: 12),
        Text(
          label,
          style: FTextStyle.desc(context)
        ),
        SizedBox(width: 12),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: FTextStyle.tittle(context),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
