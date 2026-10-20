import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/Field";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post("/register");
    }

    return (
        <div className="flex min-h-svh items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Asset Manager</CardTitle>
                    <CardDescription>
                        Crie sua conta para solicitar equipamentos
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={submit} className="grid gap-4">
                        <Field label="Nome completo" required error={errors.name}>
                            <Input
                                type="text"
                                placeholder="Seu nome"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                aria-invalid={!!errors.name}
                            />
                        </Field>

                        <Field label="E-mail" required error={errors.email}>
                            <Input
                                type="email"
                                placeholder="seu@email.com"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                aria-invalid={!!errors.email}
                            />
                        </Field>

                        <Field label="Senha" required error={errors.password}>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                aria-invalid={!!errors.password}
                            />
                        </Field>

                        <Field
                            label="Confirmar senha"
                            required
                            error={errors.password_confirmation}
                        >
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                aria-invalid={!!errors.password_confirmation}
                            />
                        </Field>

                        <Button type="submit" disabled={processing} className="mt-2 w-full">
                            {processing ? "Criando conta..." : "Criar conta"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center text-sm text-muted-foreground">
                    Já tem conta?{" "}
                    <Link
                        href="/login"
                        className="ml-1 font-medium text-primary hover:underline"
                    >
                        Fazer login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
