# pyrra-generate-action

[Pyrra](https://github.com/pyrra-dev/pyrra) was created to make SLOs with Prometheus manageable, accessible, and easy to use for everyone!

The original design expected that we'd have access to the server where Prometheus recording rules are managed or to the kubernetes cluster where the Prometheus-operator is deployed to, but that is not always true.

With that in mind, pyrra recently got a [new command `generate`](https://github.com/pyrra-dev/pyrra/pull/361) which allow us to use Pyrra as a CLI tool to read SLO definitions and create rule files that follows the Prometheus rules format. The generated files can then be used for different use cases, e.g. upload rules to a managed Prometheus service like Grafana Cloud or AWS Managed Prometheus.

## 📚 Usage

### Workflow

Create a `.yml` file in your `.github/workflows` folder (you can find more info about the structure in the [GitHub Docs](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions)):

**.github/workflows/example.yml**

```yml
on:
  push:
    branches:
      - main

jobs:
  generate_rules:
    runs-on: ubuntu-latest
    name: Generate Rules from SLOs
    steps:
      - uses: actions/checkout@v3
      - name: Generate rule files
        id: generate
        uses: ArthurSens/pyrra-generate-action@v1
        with:
          configFiles: "examples/*.yaml"
          outputFolder: "/tmp/output/"
          genericRules: true
      - name: Print rules
        working-directory: /tmp/output/
        run: find . -type f -exec cat {} \;
```

## ⚙️ Action Inputs

Here are all the inputs [pyrra-generate-action](https://github.com/ArthurSens/pyrra-generate-action) takes:

| Key | Value | Required | Default |
| ------------- | ------------- | ------------- | ------------- |
| `configFiles` | Path to SLO manifests | **Yes** | ./*.yaml |
| `outputFolder` | Path where rule files will be generated | **No** | ./output |
| `genericRules` | Enables generic recording rules generation to make it easier for tools like Grafana. Remember that generic rules arent supported for SLOs with "grouping" | **No** | false |
