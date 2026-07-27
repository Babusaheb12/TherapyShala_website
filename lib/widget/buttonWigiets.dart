import 'package:flutter/material.dart';

import '../utils/flutter_color_themes.dart';
import '../utils/flutter_font_style.dart';

class CustomButton extends StatelessWidget {
   CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.backgroundColor,
    this.textColor,
    this.height = 50,
    this.width = double.infinity,
    this.borderRadius = 20,
    this.elevation = 0,
    this.textStyle,
    this.borderSide,
  });

  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final Widget? icon;
  final Color? backgroundColor;
  final Color? textColor;
  final double height;
  final double width;
  final double borderRadius;
  final double elevation;
  final TextStyle? textStyle;
  final BorderSide? borderSide;

  @override
  Widget build(BuildContext context) {
    final effectiveBackgroundColor = backgroundColor ?? AppColors.primary;
    final effectiveTextColor = textColor ?? Colors.white;
    final effectiveTextStyle = textStyle ?? FTextStyle.onboardingButton(context);

    return SizedBox(
      width: width,
      height: height,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: effectiveBackgroundColor,
          foregroundColor: effectiveTextColor,
          disabledBackgroundColor: effectiveBackgroundColor.withValues(alpha: 0.6),
          disabledForegroundColor: effectiveTextColor.withValues(alpha: 0.6),
          elevation: elevation,
          side: borderSide,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          ),
        ),
        child: isLoading ? SizedBox( width: 24, height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(effectiveTextColor),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    icon!,
                     SizedBox(width: 8),
                  ],
                  Text(
                    text,
                    style: effectiveTextStyle,
                  ),
                ],
              ),
      ),
    );
  }
}

class CustomOutlinedButton extends StatelessWidget {
   CustomOutlinedButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
    this.borderColor,
    this.textColor,
    this.height = 50,
    this.width = double.infinity,
    this.borderRadius = 20,
    this.textStyle,
  });

  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final Widget? icon;
  final Color? borderColor;
  final Color? textColor;
  final double height;
  final double width;
  final double borderRadius;
  final TextStyle? textStyle;

  @override
  Widget build(BuildContext context) {
    final effectiveBorderColor = borderColor ?? AppColors.border;
    final effectiveTextColor = textColor ?? AppColors.textPrimary;

    return CustomButton(
      text: text,
      onPressed: onPressed,
      isLoading: isLoading,
      icon: icon,
      backgroundColor: Colors.transparent,
      textColor: effectiveTextColor,
      height: height,
      width: width,
      borderRadius: borderRadius,
      elevation: 0,
      borderSide: BorderSide(color: effectiveBorderColor, width: 1.2),
      textStyle: textStyle,
    );
  }
}
