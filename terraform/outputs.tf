output "ec2_public_ip" {
  value = aws_instance.ci_cd_ec2.public_ip
}
