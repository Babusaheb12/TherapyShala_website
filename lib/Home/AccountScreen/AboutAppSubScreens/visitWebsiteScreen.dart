import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';

class VisitWebsiteScreen extends StatelessWidget {
  VisitWebsiteScreen({super.key});

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
          Constants.visitOurWebsite,
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Website Preview Card
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
                          Icon(
                            Icons.language_rounded,
                            color: AppColors.primary,
                            size: 48,
                          ),
                          SizedBox(height: 12),
                          Text(
                            Constants.websiteUrl,
                            style: FTextStyle.header(context)
                          ),
                          SizedBox(height: 6),
                          Text(
                            Constants.exploreOurWebPortalForExclusiveOnlineBookingDeals,
                            style: FTextStyle.desc(context),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 24),

                    Text(
                      Constants.whatYouCanDoOnOurWebsite,
                      style: FTextStyle.header(context),
                    ),
                    SizedBox(height: 14),

                    _buildFeatureRow(context, Icons.computer_rounded, Constants.webServiceBooking),
                    Divider(color: Color(0xFFF0F0F3), height: 16),
                    _buildFeatureRow(context, Icons.article_outlined, Constants.readSpaWellnessBlogs),
                    Divider(color: Color(0xFFF0F0F3), height: 16),
                    _buildFeatureRow(context, Icons.storefront_outlined, Constants.organicSpaProductsShop),
                    Divider(color: Color(0xFFF0F0F3), height: 16),
                    _buildFeatureRow(context, Icons.handshake_outlined, Constants.corporatePartnerEnquiries),
                  ],
                ),
              ),
            ),

            // Bottom Action Button
            Padding(
              padding: EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: CustomButton(
                text: Constants.openWebsite,
                onPressed: () {
                  CustomSnackBar.show(
                    context,
                    message: Constants.openingWebsiteInBrowser,
                    icon: Icons.language_rounded,
                    backgroundColor: AppColors.primary,
                  );
                },
                height: 52,
                borderRadius: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureRow(BuildContext context, IconData icon, String title) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 20),
        SizedBox(width: 12),
        Expanded(
          child: Text(
            title,
            style: FTextStyle.tittle(context)
          ),
        ),
        SizedBox(width: 8),
        Icon(
          Icons.open_in_new_rounded,
          color: AppColors.textSecondary,
          size: 18,
        ),
      ],
    );
  }
}
