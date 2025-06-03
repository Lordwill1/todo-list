# terraform/outputs.tf

output "ec2_public_ip" {
  value = aws_instance.todo_ec2.public_ip
}

output "ecr_repo_url" {
  value = data.aws_ecr_repository.todo_list.repository_url
}
