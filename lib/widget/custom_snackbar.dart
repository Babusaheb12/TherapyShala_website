import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';

import '../utils/flutter_color_themes.dart';

class CustomSnackBar {
   CustomSnackBar._();

  static void show(
    BuildContext context, {
    required String message,
    required IconData icon,
    Color backgroundColor = AppColors.reds,
  }) {
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(icon, color: AppColors.white, size: 20),
             SizedBox(width: 8),
            Expanded(
              child: Text(
                message,
                style:  FTextStyle.customSnackBar(context)
              ),
            ),
          ],
        ),
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
