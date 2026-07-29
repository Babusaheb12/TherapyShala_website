import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';

class PartnerScreen extends StatelessWidget {
  PartnerScreen({super.key});

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
          Constants.partner,
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
                    // Hero Banner Card
                    Container(
                      width: double.infinity,
                      padding: EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [AppColors.primary, Color(0xFFE04362)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            Constants.becomePartner,
                            style: FTextStyle.header(context).copyWith(
                              color: AppColors.white
                            )
                          ),
                          SizedBox(height: 8),
                          Text(
                            Constants.joinThousandsOfBeautyProfessionalsAndSpaSalonsExpandingTheirBusinessWithTherapyShala,
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.9),
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 24),

                    Text(
                      Constants.whyPartnerWithUs,
                      style: FTextStyle.header(context),
                    ),
                    SizedBox(height: 14),

                    _buildBenefitTile(
                      context,
                      Icons.groups_rounded,
                      Constants.expandYourClientBase,
                      Constants.reachThousandsOfBeautyProfessionalsAndSpaSalonsExpandingTheirBusinessWithTherapyShala,
                    ),
                    SizedBox(height: 12),
                    _buildBenefitTile(
                      context,
                      Icons.schedule_rounded,
                      Constants.flexibleWorkingHours,
                      Constants.setYourOwnCalendarAvailabilityAndManageBookingsOnYourTerms,
                    ),
                    SizedBox(height: 12),
                    _buildBenefitTile(
                      context,
                      Icons.account_balance_wallet_rounded,
                      Constants.guaranteedOnTimePayouts,
                      Constants.receiveDirectWeeklyPayoutsDirectlyToYourRegisteredBankAccountHassleFree,
                    ),
                    SizedBox(height: 12),
                    _buildBenefitTile(
                      context,
                      Icons.headset_mic_rounded,
                      Constants.twentyFourSevenDedicatedSupport,
                      Constants.ourPartnerSupportTeamIsAlwaysAvailableToHelpYouDeliverTopQualityService,
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Action Button
            Padding(
              padding: EdgeInsets.fromLTRB(20, 10, 20, 24),
              child: CustomButton(
                text: Constants.applyAsPartner,
                onPressed: () {
                  CustomSnackBar.show(
                    context,
                    message: Constants.partnerApplicationRequestSubmitted,
                    icon: Icons.check_circle_rounded,
                    backgroundColor: AppColors.add,
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

  Widget _buildBenefitTile(
    BuildContext context,
    IconData icon,
    String title,
    String description,
  ) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Color(0xFFEBEBEB)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Color(0xFFFFF0F3),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: AppColors.primary, size: 22),
          ),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: FTextStyle.tittle(context)
                ),
                SizedBox(height: 4),
                Text(
                  description,
                  style: FTextStyle.desc(context)
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
