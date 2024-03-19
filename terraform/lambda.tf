locals {
  team   = "Avengers"
  domain = "Earth"
}

#=== tsfunc lambda

data "archive_file" "tsfunc" {
  type        = "zip"
  source_file = "../src/tsfunc/dist/lambda.js"
  output_path = "../src/tsfunc/dist/lambda.zip"
}

resource "aws_lambda_function" "tsfunc" {
  function_name    = "${var.service_name}_tsfunc"
  handler          = "lambda.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.tsfunc.output_path
  role             = aws_iam_role.allow_lambda.arn
  memory_size      = 256
  source_code_hash = filebase64sha256(data.archive_file.tsfunc.output_path)
  logging_config {
    log_format            = "JSON"
    application_log_level = "INFO"
    system_log_level      = "WARN"
  }
  environment {
    variables = {
      POWERTOOLS_SERVICE_NAME = var.service_name
      APP_TEAM                = local.team
      APP_DOMAIN              = local.domain
    }
  }
}

resource "aws_cloudwatch_log_group" "tsfunc" {
  name              = "/aws/lambda/${aws_lambda_function.tsfunc.function_name}"
  retention_in_days = 3
}

