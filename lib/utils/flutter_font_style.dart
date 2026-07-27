import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'size_config.dart';

class FTextStyle {
  static const String fontFamily = 'Poppins';

  static TextStyle onboardingHeading(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontSize: getResponsiveFontSize(context, 24.33),
    fontWeight: FontWeight.w700,
    // fontWeight: FontWeight.bold,
  );

  static TextStyle onboardingDesc(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontWeight: FontWeight.w400,
    fontSize: getResponsiveFontSize(context, 15),
    height: 1.45,
    letterSpacing: -0.35,
  );

  static TextStyle onboardingButton(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontWeight: FontWeight.w500,
    fontSize: getResponsiveFontSize(context, 18),
    height: 1.2,
  );

  static TextStyle onboardingAccount(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontWeight: FontWeight.w400,
    fontSize: getResponsiveFontSize(context, 15),
    height: 1.2,
  );

  static TextStyle chooseRoleTitle(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontWeight: FontWeight.w500,
    fontSize: getResponsiveFontSize(context, 27),
    height: 1.25,
  );

  static TextStyle chooseRoleSubtitle(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontWeight: FontWeight.w400,
    color: AppColors.border,
    fontSize: getResponsiveFontSize(context, 15),
    height: 1.45,
  );

  static TextStyle chooseRoleButton(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontWeight: FontWeight.w500,
    color: AppColors.white,
    fontSize: getResponsiveFontSize(context, 16),
  );

  static TextStyle loginChoosesHeading(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontWeight: FontWeight.w800, // Regular weight (400)
    fontSize: getResponsiveFontSize(context, 26), // 14px
    color: Colors.white,
    height: 1.1,
  );

  static TextStyle loginChoosesSubHeading(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontWeight: FontWeight.w800, // Regular weight (400)
    fontSize: getResponsiveFontSize(context, 26), // 14px
    color: Colors.white,
    height: 1.1,
  );

  static TextStyle loginChoosesDesc(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontWeight: FontWeight.w500, // Regular weight (400)
    fontSize: getResponsiveFontSize(context, 16), // 14px
    // color: AppColors.white75,
    height: 1.4,
  );

  static TextStyle loginHeading(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontSize: getResponsiveFontSize(context, 24),
    fontWeight: FontWeight.w900,
    // color:  AppColors.black,
    height: 1.2,
  );

  static TextStyle loginDesc(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontSize: getResponsiveFontSize(context, 14),
    fontWeight: FontWeight.w400,
    color: Color(0xFF73565A),
  );

  static TextStyle registerHeading(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontSize: getResponsiveFontSize(context, 24),
    fontWeight: FontWeight.w900,
    // color:  AppColors.black,
    height: 1.2,
  );

  static TextStyle registerSubHeading(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontSize: getResponsiveFontSize(context, 16),
    fontWeight: FontWeight.w500,
    // color: AppColors.softGreyText,
  );

  static TextStyle tittle(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontSize: getResponsiveFontSize(context, 16),
    fontWeight: FontWeight.w600,
    // color: AppColors.black,
  );

  static TextStyle desc(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontSize: getResponsiveFontSize(context, 14),
    fontWeight: FontWeight.w500,
    // color: AppColors.softGreyText,
  );

  static TextStyle textfieldLabel(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontSize: getResponsiveFontSize(context, 16),
    fontWeight: FontWeight.bold,
    color: Color(0xFF42282B).withOpacity(0.8),
    // color: Color(0xFFC3B4B6),  /// hint text color
  );

  static TextStyle textfieldHintText(BuildContext context) => TextStyle(
    fontFamily: fontFamily,
    fontSize: getResponsiveFontSize(context, 14),
    fontWeight: FontWeight.w500,
    // color:  Color(0xFF42282B).withOpacity(0.8),
    color: Color(0xFFC3B4B6),

    /// hint text color
  );

  static double getResponsiveFontSize(BuildContext context, double size) {
    SizeConfig.init(context);
    double textScale = MediaQuery.of(context).textScaleFactor;
    bool isLandscape =
        MediaQuery.of(context).orientation == Orientation.landscape;
    double baseSize;
    if (isLandscape) {
      baseSize = SizeConfig.screenHeight;
    } else {
      baseSize = SizeConfig.screenWidth;
    }
    return baseSize * 0.0025 * size * textScale;
  }

  //  style: FTextStyle.messageTittle(context).copyWith(color: AppColors.brand), // sortFilter
}
