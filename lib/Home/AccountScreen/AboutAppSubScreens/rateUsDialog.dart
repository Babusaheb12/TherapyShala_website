import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';

class RateUsDialog extends StatefulWidget {
  RateUsDialog({super.key});

  static void show(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => RateUsDialog(),
    );
  }

  @override
  State<RateUsDialog> createState() => _RateUsDialogState();
}

class _RateUsDialogState extends State<RateUsDialog> {
  int _rating = 5;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
      ),
      backgroundColor: Colors.white,
      elevation: 0,
      child: Padding(
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header Icon
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: Color(0xFFFFF0F3),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Icon(
                  Icons.star_rounded,
                  color: Color(0xFFFDBB3E),
                  size: 42,
                ),
              ),
            ),

            SizedBox(height: 16),

            Text(
              Constants.enjoyingTherapyShala,
              style: FTextStyle.header(context),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 8),
            Text(
              Constants.tapAStarToRateUsOnTheAppStore,
              style: FTextStyle.desc(context),
              textAlign: TextAlign.center,
            ),

            SizedBox(height: 20),

            // Star Rating Row
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (index) {
                final starVal = index + 1;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _rating = starVal;
                    });
                  },
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 4),
                    child: Icon(
                      starVal <= _rating
                          ? Icons.star_rounded
                          : Icons.star_outline_rounded,
                      color: starVal <= _rating
                          ? Color(0xFFFDBB3E)
                          : AppColors.border,
                      size: 34,
                    ),
                  ),
                );
              }),
            ),

            SizedBox(height: 24),

            // Submit Button
            CustomButton(
              text: Constants.submitRating,
              onPressed: () {
                Navigator.pop(context);
                CustomSnackBar.show(
                  context,
                  message: Constants.thankYouForRatingTherapyShala,
                  icon: Icons.favorite_rounded,
                  backgroundColor: AppColors.add,
                );
              },
              height: 48,
              borderRadius: 14,
            ),

            SizedBox(height: 8),

            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                Constants.noThanks,
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
