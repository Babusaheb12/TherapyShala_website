import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';

class TermsOfUseScreen extends StatelessWidget {
  TermsOfUseScreen({super.key});

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
          Constants.termsOfUse,
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
              _buildSection(
                context,
                "1. Acceptance of Terms",
                "By downloading, accessing, or using TherapyShala, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.",
              ),
              _buildSection(
                context,
                "2. User Account Obligations",
                "You are responsible for maintaining the confidentiality of your mobile authentication details and for restricting access to your device. You agree to accept responsibility for all activities that occur under your account.",
              ),
              _buildSection(
                context,
                "3. Service Availability & Bookings",
                "Appointments booked through TherapyShala are subject to therapist availability. TherapyShala reserves the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice.",
              ),
              _buildSection(
                context,
                "4. Intellectual Property",
                "All content, logos, branding, graphics, and software used in TherapyShala are the property of TherapyShala Technologies Pvt. Ltd. and are protected by applicable intellectual property laws.",
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSection(BuildContext context, String heading, String body) {
    return Padding(
      padding: EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            heading,
            style: FTextStyle.header(context)
          ),
          SizedBox(height: 8),
          Text(
            body,
            style: FTextStyle.desc(context)
          ),
        ],
      ),
    );
  }
}
